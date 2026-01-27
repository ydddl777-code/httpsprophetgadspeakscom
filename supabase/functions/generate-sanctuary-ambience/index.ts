import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Generate a small, looping ambient track directly (no external fetches).
// This avoids 3rd-party CDNs blocking edge runtimes (403/500) and keeps the app reliable.

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

  // RIFF header
  writeAscii(view, 0, "RIFF");
  view.setUint32(4, 36 + dataSize, true);
  writeAscii(view, 8, "WAVE");

  // fmt chunk
  writeAscii(view, 12, "fmt ");
  view.setUint32(16, 16, true); // PCM
  view.setUint16(20, 1, true); // audio format = PCM
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, byteRate, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, 16, true); // bits per sample

  // data chunk
  writeAscii(view, 36, "data");
  view.setUint32(40, dataSize, true);

  // PCM data
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

  // A soft, slow chord (G major) to match the “sanctuary” vibe.
  const freqs = [196.0, 246.94, 293.66];
  const twoPi = Math.PI * 2;

  // Envelope: slow fade-in/out within the clip to prevent clicks on loop.
  const fadeSeconds = Math.min(1.5, seconds / 6);
  const fadeSamples = Math.max(1, Math.floor(sampleRate * fadeSeconds));

  for (let i = 0; i < totalSamples; i++) {
    const t = i / sampleRate;

    let s = 0;
    for (let f = 0; f < freqs.length; f++) {
      // Slight detune and 2nd harmonic for warmth
      const base = freqs[f];
      const detune = (f - 1) * 0.12; // small cents-ish
      const w = twoPi * (base + detune);
      s += Math.sin(w * t) * 0.22;
      s += Math.sin(w * 2 * t) * 0.06;
    }

    // Very subtle tremolo to keep it alive (still “sedate”)
    const trem = 0.92 + 0.08 * Math.sin(twoPi * 0.09 * t);
    s *= trem;

    // fade-in/out envelope
    let env = 1;
    if (i < fadeSamples) env = clamp01(i / fadeSamples);
    else if (i > totalSamples - fadeSamples) env = clamp01((totalSamples - i) / fadeSamples);

    // overall amplitude (kept low; client controls volume 5%–30%)
    const amp = 0.55;
    const v = s * env * amp;

    // Convert to 16-bit PCM
    const pcm = Math.max(-1, Math.min(1, v));
    out[i] = (pcm * 32767) | 0;
  }

  return buildWavPcm16Mono(out, sampleRate);
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const wavBytes = generateAmbientOrgan({ sampleRate: 22050, seconds: 12 });

    // Some Deno/TS lib typings treat Uint8Array.buffer as ArrayBufferLike (can be SharedArrayBuffer).
    // Create a fresh ArrayBuffer-backed copy to satisfy BlobPart typing.
    const bytes = new Uint8Array(wavBytes.length);
    bytes.set(wavBytes);
    const body = new Blob([bytes.buffer], { type: "audio/wav" });
    return new Response(body, {
      headers: {
        ...corsHeaders,
        "Content-Type": "audio/wav",
        // cache for an hour to reduce repeated loads
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (error) {
    console.error("Error fetching sanctuary ambience:", error);
    return new Response(
      JSON.stringify({ error: "Failed to load ambient audio" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});