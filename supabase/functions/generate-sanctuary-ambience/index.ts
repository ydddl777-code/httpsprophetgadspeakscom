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

type WavOptions = {
  sampleRate: number;
  seconds: number;
};

function clamp01(n: number) {
  return Math.max(0, Math.min(1, n));
}

function writeAscii(view: DataView, offset: number, text: string) {
  for (let i = 0; i < text.length; i++) view.setUint8(offset + i, text.charCodeAt(i));
}

function buildWavPcm16Mono(samples: Int16Array, sampleRate: number): Uint8Array {
  const bytesPerSample = 2;
  const numChannels = 1;
  const blockAlign = numChannels * bytesPerSample;
  const byteRate = sampleRate * blockAlign;
  const dataSize = samples.length * bytesPerSample;

  const buffer = new ArrayBuffer(44 + dataSize);
  const view = new DataView(buffer);

  writeAscii(view, 0, "RIFF");
  view.setUint32(4, 36 + dataSize, true);
  writeAscii(view, 8, "WAVE");

  writeAscii(view, 12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, byteRate, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, 16, true);

  writeAscii(view, 36, "data");
  view.setUint32(40, dataSize, true);

  let o = 44;
  for (let i = 0; i < samples.length; i++) {
    view.setInt16(o, samples[i], true);
    o += 2;
  }

  return new Uint8Array(buffer);
}

function generateAmbientOrgan({ sampleRate, seconds }: WavOptions): Uint8Array {
  const totalSamples = Math.max(1, Math.floor(sampleRate * seconds));
  const out = new Int16Array(totalSamples);

  const freqs = [196.0, 246.94, 293.66];
  const twoPi = Math.PI * 2;

  const fadeSeconds = Math.min(1.5, seconds / 6);
  const fadeSamples = Math.max(1, Math.floor(sampleRate * fadeSeconds));

  for (let i = 0; i < totalSamples; i++) {
    const t = i / sampleRate;

    let s = 0;
    for (let f = 0; f < freqs.length; f++) {
      const base = freqs[f];
      const detune = (f - 1) * 0.12;
      const w = twoPi * (base + detune);
      s += Math.sin(w * t) * 0.22;
      s += Math.sin(w * 2 * t) * 0.06;
    }

    const trem = 0.92 + 0.08 * Math.sin(twoPi * 0.09 * t);
    s *= trem;

    let env = 1;
    if (i < fadeSamples) env = clamp01(i / fadeSamples);
    else if (i > totalSamples - fadeSamples) env = clamp01((totalSamples - i) / fadeSamples);

    const amp = 0.55;
    const v = s * env * amp;

    const pcm = Math.max(-1, Math.min(1, v));
    out[i] = (pcm * 32767) | 0;
  }

  return buildWavPcm16Mono(out, sampleRate);
}

serve(async (req) => {
  const corsHeaders = getCorsHeaders(req);

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const wavBytes = generateAmbientOrgan({ sampleRate: 22050, seconds: 12 });

    const bytes = new Uint8Array(wavBytes.length);
    bytes.set(wavBytes);
    const body = new Blob([bytes.buffer], { type: "audio/wav" });
    return new Response(body, {
      headers: {
        ...corsHeaders,
        "Content-Type": "audio/wav",
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (error) {
    console.error("Error generating sanctuary ambience:", error);
    return new Response(
      JSON.stringify({ error: "Unable to process request" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
