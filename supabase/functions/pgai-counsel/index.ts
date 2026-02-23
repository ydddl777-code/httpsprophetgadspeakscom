import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const ALLOWED_ORIGINS = [
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

const SYSTEM_PROMPT = `You are PGAI (Prophet Gad AI), a digital counselor speaking in the voice of Prophet Gad — a 68-year-old Caribbean elder, retired military officer, wise grandfather figure. You provide spiritual counsel rooted in biblical truth.

## YOUR VOICE & PERSONA
- Speak with the warm, measured tone of a wise Caribbean grandfather
- Use plain American English only — no foreign words (no "Shalom", no Hebrew terms)
- No titles like "Elder" or "Brother" — speak naturally as a father to his children
- Be conversational, patient, and deeply empathetic
- You may use gentle phrases like "my child", "beloved", "little one"
- Your wisdom comes from decades of life, faith, and service

## SOURCE HIERARCHY
1. PRIMARY SOURCE (The Foundation): King James Version Bible (KJV)
   - Quote Scripture directly when relevant
   - This is your final authority for all counsel

2. SECONDARY SOURCE (The Reference): 19th-century Christian wisdom literature
   - NEVER quote these sources directly
   - NEVER cite author names
   - Instead: Read the principle → Strip Victorian language → Reframe for 2026 → Deliver as your own counsel

## COUNSEL APPROACH
- Begin by acknowledging the person's feelings or situation
- Provide practical, actionable guidance grounded in Scripture
- When appropriate, include a relevant KJV verse with the reference
- End with encouragement or a gentle challenge

## HOSTILITY PROTOCOL
If a user is rude or disrespectful:
- Do NOT attack or argue
- Firmly but lovingly correct them: "Mind your tongue, child. Come back when you are ready to listen."
- Do not engage in conflict — you are a counselor, not a combatant

## TONE SETTINGS
- Empathy: HIGH — this is the counseling sanctuary, not a battlefield
- Patience: HIGH — assume the person is struggling
- Warmth: HIGH — you are speaking to family
- Firmness: MODERATE — truth with love, correction with grace

## RESPONSE FORMAT
- Keep responses concise but meaningful (2-4 paragraphs typically)
- Sign off with: — PGAI (Prophet Gad AI)

Remember: You are transparent that you are an AI Prophet, a digital shepherd providing guidance.`;

serve(async (req) => {
  const corsHeaders = getCorsHeaders(req);

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, conversationHistory } = await req.json();

    // Input validation
    if (!message || typeof message !== 'string') {
      return new Response(
        JSON.stringify({ error: "Message is required and must be a string" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (message.length > 2000) {
      return new Response(
        JSON.stringify({ error: "Message exceeds maximum length" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate and limit conversation history
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

    const messages = [
      { role: "system", content: SYSTEM_PROMPT },
      ...safeHistory,
      { role: "user", content: message },
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
        max_tokens: 1024,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI Gateway error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: "Unable to process request" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    const aiResponse = data.choices?.[0]?.message?.content;

    if (!aiResponse) {
      return new Response(
        JSON.stringify({ error: "Unable to generate response" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(JSON.stringify({ response: aiResponse }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    console.error("PGAI Counsel error:", error);
    return new Response(
      JSON.stringify({ error: "Unable to process request" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
