// Gemini TTS edge function.
//
// Calls Google's Gemini 2.5 Flash TTS model to turn text into speech.
// Returns WAV audio as base64 (prepending a WAV header to the raw PCM
// Gemini returns), so the client can just do `new Audio(dataUrl).play()`
// — same interface as the ElevenLabs TTS function it complements.
//
// Why Gemini TTS instead of ElevenLabs as default:
//   - Far more generous free tier via AI Studio (no credit card needed)
//   - Native emotional/stylistic prompting (we can prefix "Speak softly"
//     or "Speak with urgency" to shape the delivery)
//   - ~4x cheaper per character if/when we cross into paid usage
//
// Requires GEMINI_API_KEY set as a Supabase secret.

import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { encode as base64Encode } from "https://deno.land/std@0.168.0/encoding/base64.ts";

const ALLOWED_ORIGINS = [
  'https://theprophetgad.com',
  'https://www.theprophetgad.com',
  'https://ferventcounsel.com',
  'https://www.ferventcounsel.com',
  'https://httpsprophetgadspeakscom.lovable.app',
  'https://id-preview--e8e7cee6-b4f3-4ad6-8680-e6fd0c2465f5.lovable.app',
  'http://localhost:5173',
  'http://localhost:8080',
];

function getCorsHeaders(req: Request) {
  const origin = req.headers.get('Origin') || '';
  return {
    'Access-Control-Allow-Origin': ALLOWED_ORIGINS.some(o => origin.startsWith(o)) ? origin : '',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
  };
}

// Gemini's prebuilt voice names. Chosen for a prophet interceding with
// gravitas. "Charon" is grave and measured — our default. Alternatives:
//   - Orus (firm, authoritative)
//   - Algenib (gravelly, older)
//   - Alnilam (steady)
//   - Rasalgethi (informative)
//   - Sulafat (warm — alternative if the matter is tender)
const DEFAULT_VOICE = 'Charon';

const VALID_VOICES = new Set([
  'Zephyr', 'Puck', 'Charon', 'Kore', 'Fenrir', 'Leda', 'Orus', 'Aoede',
  'Callirrhoe', 'Autonoe', 'Enceladus', 'Iapetus', 'Umbriel', 'Algieba',
  'Despina', 'Erinome', 'Algenib', 'Rasalgethi', 'Laomedeia', 'Achernar',
  'Alnilam', 'Schedar', 'Gacrux', 'Pulcherrima', 'Achird', 'Zubenelgenubi',
  'Vindemiatrix', 'Sadachbia', 'Sadaltager', 'Sulafat',
]);

// Gemini returns raw PCM at 24kHz, 16-bit, mono (LINEAR16). Browsers can't
// play raw PCM directly, so we wrap it in a WAV header (44 bytes) so the
// resulting Blob is a valid audio/wav file.
function wrapPcmAsWav(pcmBytes: Uint8Array, sampleRate = 24000): Uint8Array {
  const numChannels = 1;
  const bitsPerSample = 16;
  const byteRate = sampleRate * numChannels * (bitsPerSample / 8);
  const blockAlign = numChannels * (bitsPerSample / 8);
  const dataSize = pcmBytes.length;
  const fileSize = 36 + dataSize;

  const buffer = new ArrayBuffer(44 + dataSize);
  const view = new DataView(buffer);
  const writeString = (offset: number, s: string) => {
    for (let i = 0; i < s.length; i++) view.setUint8(offset + i, s.charCodeAt(i));
  };

  // RIFF header
  writeString(0, 'RIFF');
  view.setUint32(4, fileSize, true);
  writeString(8, 'WAVE');

  // fmt subchunk
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true);               // Subchunk1Size (16 for PCM)
  view.setUint16(20, 1, true);                // AudioFormat (1 = PCM)
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, byteRate, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitsPerSample, true);

  // data subchunk
  writeString(36, 'data');
  view.setUint32(40, dataSize, true);

  // PCM data
  new Uint8Array(buffer, 44).set(pcmBytes);
  return new Uint8Array(buffer);
}

serve(async (req) => {
  const corsHeaders = getCorsHeaders(req);

  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text, voice, style } = await req.json();

    // Input validation
    if (!text || typeof text !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Text is required and must be a string' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    if (text.length > 5000) {
      return new Response(
        JSON.stringify({ error: 'Text exceeds maximum length (5000 chars)' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    const voiceName =
      voice && typeof voice === 'string' && VALID_VOICES.has(voice)
        ? voice
        : DEFAULT_VOICE;

    const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');
    if (!GEMINI_API_KEY) {
      console.error('GEMINI_API_KEY not configured');
      return new Response(
        JSON.stringify({ error: 'Service temporarily unavailable' }),
        { status: 503, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Gemini TTS supports an optional "style" directive as a prefix —
    // examples: "Speak slowly and reverently:", "Speak with urgency:".
    // When caller provides one, we prepend it to shape the delivery.
    const styledText = style && typeof style === 'string' ? `${style}: ${text}` : text;

    const geminiUrl =
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent?key=' +
      encodeURIComponent(GEMINI_API_KEY);

    const geminiResponse = await fetch(geminiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: styledText }] }],
        generationConfig: {
          responseModalities: ['AUDIO'],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: {
                voiceName,
              },
            },
          },
        },
      }),
    });

    if (!geminiResponse.ok) {
      const errorText = await geminiResponse.text();
      console.error('Gemini TTS error:', geminiResponse.status, errorText);
      return new Response(
        JSON.stringify({ error: 'Unable to generate speech' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await geminiResponse.json();
    const audioBase64Raw =
      data?.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

    if (!audioBase64Raw) {
      console.error('Gemini TTS returned no audio payload:', JSON.stringify(data).slice(0, 500));
      return new Response(
        JSON.stringify({ error: 'No audio returned from TTS' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Decode base64 raw PCM → wrap as WAV → re-encode base64
    const binary = atob(audioBase64Raw);
    const pcmBytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) pcmBytes[i] = binary.charCodeAt(i);
    const wavBytes = wrapPcmAsWav(pcmBytes, 24000);
    const wavBase64 = base64Encode(wavBytes);

    return new Response(
      JSON.stringify({
        audio: wavBase64,
        mimeType: 'audio/wav',
        voice: voiceName,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error: unknown) {
    console.error('Gemini TTS handler error:', error);
    return new Response(
      JSON.stringify({ error: 'Unable to process request' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
