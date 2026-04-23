import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const ALLOWED_ORIGINS = [
  'https://theprophetgad.com',
  'https://www.theprophetgad.com',
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
          model_id: "eleven_multilingual_v2",
          voice_settings: {
            stability: 0.75,
            similarity_boost: 0.78,
            style: 0.25,
            use_speaker_boost: true,
            speed: 0.82,
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
