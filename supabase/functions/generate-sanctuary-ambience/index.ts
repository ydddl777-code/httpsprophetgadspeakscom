import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Royalty-free ambient organ music URL (public domain)
const FALLBACK_AUDIO_URL = "https://cdn.pixabay.com/audio/2024/11/29/audio_a93d0bb00a.mp3";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Fetch the fallback ambient audio
    const response = await fetch(FALLBACK_AUDIO_URL);

    if (!response.ok) {
      throw new Error(`Failed to fetch ambient audio: ${response.status}`);
    }

    const audioBuffer = await response.arrayBuffer();

    return new Response(audioBuffer, {
      headers: {
        ...corsHeaders,
        "Content-Type": "audio/mpeg",
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