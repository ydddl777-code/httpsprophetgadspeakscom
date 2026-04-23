import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// Allow our production domains, the published Lovable URL, the static
// preview URL, AND the live in-editor preview origin (which is
// `*.lovableproject.com` — easy to miss). Without `lovableproject.com`
// the browser blocks the response and the TTS hook silently falls back
// to the Google browser voice instead of Prophet Gad.
const ALLOWED_ORIGIN_SUFFIXES = [
  'theprophetgad.com',
  'lovable.app',
  'lovableproject.com',
  'localhost',
];

function getCorsHeaders(req: Request) {
  const origin = req.headers.get('Origin') || '';
  let allowed = '';
  try {
    const host = new URL(origin).hostname;
    if (ALLOWED_ORIGIN_SUFFIXES.some((s) => host === s || host.endsWith('.' + s) || host.startsWith('localhost'))) {
      allowed = origin;
    }
  } catch {
    // bad/empty origin — leave allowed = ''
  }
  return {
    'Access-Control-Allow-Origin': allowed,
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
    'Access-Control-Expose-Headers': 'X-TTS-Provider-Error',
    'Vary': 'Origin',
  };
}

// Prophet Gad voice 12 — the user's custom-cloned ElevenLabs voice.
// This is the DEFAULT voice for the entire app (Prophet Gad / PGAI).
const PROPHET_GAD_VOICE_ID = '4qujSOEOIeR7wnstHIXO';

const VALID_VOICE_IDS = [
  PROPHET_GAD_VOICE_ID,
  'JBFqnCBsd6RMkjVDRZzb', 'EXAVITQu4vr4xnSDxMaL', 'onwK4e9ZLuTAKqWW03F9',
  'pFZP5JQG7iQjIQuC4Bku', 'nPczCjzI2devNBz1zQrb', 'CwhRBWXzGAHq8TQ4Fs17',
  'FGY2WhTYpPnrIDTdsKH5', 'IKne3meq5aSn9XLyUdCD', 'N2lVS1w4EtoT3dr4eOWO',
  'SAz9YHcvj6GT2YYXdXww', 'TX3LPaxmHKxFdv7VOQHJ', 'Xb7hH8MSUJpSbSDYk0k2',
  'XrExE9yKIg1WjnnlVkGX', 'bIHbv24MWmeRgasZH58o', 'cgSgspJ2msm6clMCkdW9',
  'cjVigY5qzO86Huf0OWal', 'iP95p4xoKVk53GoZ742B',
];

serve(async (req) => {
  const corsHeaders = getCorsHeaders(req);

  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text, voiceId } = await req.json();
    const ELEVENLABS_API_KEY = Deno.env.get("ELEVENLABS_API_KEY");

    if (!ELEVENLABS_API_KEY) {
      console.error("ELEVENLABS_API_KEY not configured");
      return new Response(
        JSON.stringify({ error: "Service temporarily unavailable" }),
        { status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Input validation
    if (!text || typeof text !== 'string') {
      return new Response(
        JSON.stringify({ error: "Text is required and must be a string" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (text.length > 5000) {
      return new Response(
        JSON.stringify({ error: "Text exceeds maximum length of 5000 characters" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate voiceId — default to the Prophet Gad cloned voice.
    const selectedVoiceId = (voiceId && VALID_VOICE_IDS.includes(voiceId)) ? voiceId : PROPHET_GAD_VOICE_ID;

    // ElevenLabs v3 (alpha) — supports inline emotional audio tags like
    // [whispers], [sighs], [crying], [pleading], [trembling voice],
    // [long pause]. Lower stability ("Creative") lets the model actually
    // act on those tags. v3 falls back gracefully if a tag is unknown.
    //
    // We send the text untouched — the prayer engine embeds tags inline
    // at the right beats so the prophet weeps and pleads on the line that
    // calls for it, not on the whole prayer.
    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${selectedVoiceId}?output_format=mp3_44100_128`,
      {
        method: "POST",
        headers: {
          "xi-api-key": ELEVENLABS_API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text,
          model_id: "eleven_v3",
          voice_settings: {
            // Creative range — lets v3 honour emotional tags. Higher
            // stability flattens delivery back to neutral.
            stability: 0.35,
            similarity_boost: 0.80,
            // High style so weeping / pleading actually lands.
            style: 0.65,
            use_speaker_boost: true,
            speed: 0.88,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("ElevenLabs API error:", response.status, errorText);

      return new Response(
        JSON.stringify({ error: "Unable to generate speech" }),
        {
          status: 200,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
            "X-TTS-Provider-Error": "1",
          },
        }
      );
    }

    const audioBuffer = await response.arrayBuffer();

    return new Response(audioBuffer, {
      headers: {
        ...corsHeaders,
        "Content-Type": "audio/mpeg",
      },
    });
  } catch (err) {
    console.error("TTS Error:", err);
    return new Response(
      JSON.stringify({ error: "Unable to process request" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
