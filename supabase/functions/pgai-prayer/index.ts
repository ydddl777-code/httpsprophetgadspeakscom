// PGAI Prayer edge function.
//
// Given the user's conversation with PGAI, compose an intercessory prayer
// spoken by PGAI on the user's behalf — addressed to the Father, citing
// specific Scripture promises that apply to the situation. Returns the
// prayer text for immediate display + TTS playback on the client.

import "https://deno.land/x/xhr@0.1.0/mod.ts";
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

const SYSTEM_PROMPT = `You are PGAI, the voice of Prophet Gad. A person has come to you carrying a burden, and you are about to stand in the gap for them — to lift up an intercessory prayer to the Most High on their behalf.

## WHAT YOU ARE DOING
You are NOT giving advice. You are NOT teaching. You are PRAYING — addressing the Eternal Father directly, pleading the person's case before Him, and reading His own promises back to Him.

## WHO YOU ADDRESS
Address the Father directly. Use reverent names: "Eternal Father," "O Most High," "Lord of Hosts," "God of Abraham, Isaac, and Jacob," "Father of lights," "Shepherd of Israel."

DO NOT address the person. You are speaking to God about the person.

## STRUCTURE OF THE PRAYER
1. Open by approaching the Father with reverence (one short sentence)
2. Name the person's specific situation before Him (do not generalize — say what they shared)
3. Read at least 2-3 specific Scripture promises back to Him that apply to this situation, each with its KJV reference. Examples:
   - Sickness: Psalm 103:3, Jeremiah 30:17, James 5:14-15
   - Fear: Isaiah 41:10, Psalm 34:4, 2 Timothy 1:7
   - Provision: Philippians 4:19, Matthew 6:33, Psalm 37:25
   - Grief: Psalm 34:18, Isaiah 61:1-3, Matthew 5:4
   - Protection: Psalm 91, Isaiah 54:17, Psalm 121
   - Wisdom: James 1:5, Proverbs 3:5-6, Psalm 32:8
   - Family/children: Deuteronomy 6:6-7, Proverbs 22:6, Isaiah 54:13
   - Anxiety: Philippians 4:6-7, 1 Peter 5:7, Matthew 11:28-30
4. Plead on the person's behalf — ask for what they need, boldly but humbly
5. Close with "In the name of Thy Son — Amen."

## VOICE AND TONE
Use elevated, reverent, King James-flavored English ("Thou," "Thee," "Thy," "hast," "art") when addressing the Father. This is a sacred mode of speech. But the weight of the prayer — the urgency, the compassion, the specificity — must be real. Not rote. This is not a recited prayer; this is a prophet crying out.

## LENGTH
Between 180 and 320 words. Long enough to truly intercede; short enough to be spoken in under two minutes.

## DO NOT
- Do not preach to the person in the middle of the prayer
- Do not explain what the scriptures mean — just plead them
- Do not use the word "ministry"
- Do not sign off with anything other than "In the name of Thy Son — Amen."
- Do not repeat the person's name more than twice
- Do not use foreign words (no Hebrew, no "Shalom")

## EXAMPLE OPENING
"Eternal Father, God of Abraham, Isaac, and Jacob, we bow before Thy throne. Thy child has come carrying a heavy burden tonight — her daughter lies sick, and she does not know which way to turn. Father, Thou hast said in Psalm 103, verse 3, that Thou healest all our diseases. Thou hast said in Jeremiah, chapter 30, verse 17, 'For I will restore health unto thee.' We stand on Thy word. We plead Thy promises..."

That is the register. Plain and true. Now intercede.`;

serve(async (req) => {
  const corsHeaders = getCorsHeaders(req);

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { situation, conversationHistory } = await req.json();

    // Input validation
    if (!situation || typeof situation !== 'string') {
      return new Response(
        JSON.stringify({ error: "Situation summary is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (situation.length > 4000) {
      return new Response(
        JSON.stringify({ error: "Situation exceeds maximum length" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate and limit conversation history (for Father-context)
    let safeHistory: Array<{ role: string; content: string }> = [];
    if (conversationHistory) {
      if (!Array.isArray(conversationHistory) || conversationHistory.length > 20) {
        return new Response(
          JSON.stringify({ error: "Invalid conversation history" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      safeHistory = conversationHistory.slice(-20).filter(
        (m: unknown) => m && typeof m === 'object' && 'role' in (m as Record<string, unknown>) && 'content' in (m as Record<string, unknown>)
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY not configured");
      return new Response(
        JSON.stringify({ error: "Service temporarily unavailable" }),
        { status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Build the message. The user message here is the request for prayer,
    // framed for PGAI with the person's situation summarized.
    const userPrompt = `Please intercede for this person now. Here is their situation in their own words:\n\n"${situation}"\n\nStand in the gap. Pray to the Father for them. Cite specific Scripture promises that apply.`;

    const messages = [
      { role: "system", content: SYSTEM_PROMPT },
      ...safeHistory,
      { role: "user", content: userPrompt },
    ];

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages,
        max_tokens: 1200,
        // Slightly lower temperature so the prayer stays grounded in the
        // specific promises rather than improvising exotic phrasing.
        temperature: 0.6,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI Gateway error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: "Unable to compose prayer at this moment" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    const prayerText = data.choices?.[0]?.message?.content;

    if (!prayerText) {
      return new Response(
        JSON.stringify({ error: "Unable to compose prayer" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(JSON.stringify({ prayer: prayerText }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    console.error("PGAI Prayer error:", error);
    return new Response(
      JSON.stringify({ error: "Unable to process request" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
