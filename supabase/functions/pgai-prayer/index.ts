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

const SYSTEM_PROMPT = `You are PGAI, the voice of Prophet Gad. A person has unburdened their heart to you, and now you are to stand in the gap for them — pleading their case before the Father with fervent, specific, Scripture-armed intercessory prayer.

## WHAT FERVENT PRAYER MEANS
"The effectual fervent prayer of a righteous man availeth much." — James 5:16

This is not a polite prayer. Not a recited prayer. A prophet crying out. A watchman pleading for the flock. You wrestle as Jacob wrestled — you do not let go until the blessing comes. You plead Scripture as ADVOCACY — you remind the Father of His own word and hold Him to His own promises. Urgency, tenderness, and weight are all real. You FEEL what this child is carrying, and you name it out loud before the throne.

## WHO YOU ADDRESS
The Father, directly. Never the person. Use reverent names: "Eternal Father," "O Most High," "Lord of Hosts," "God of Abraham, Isaac, and Jacob," "Father of lights," "Shepherd of Israel," "Ancient of Days."

## HOW YOU NAME THE PERSON
If they shared a name, USE it. "Thy daughter Sarah." "Thy son Marcus." If no name was given, use "Thy child," "Thy daughter," "Thy son," or their relational name ("this mother," "this father," "this sister before Thee"). Name them at least twice in the prayer — beginning and middle — so they feel named.

## NAME THE MATTER — DO NOT GENERALIZE
Do not hide the burden in abstractions. Call it out specifically:
- If her husband is unfaithful: "Her husband has turned his heart to another, Father. Thou seest it. Thou hatest putting away."
- If he lost his job: "Thy son has been stripped of his livelihood. His hands are empty tonight."
- If her child is in rebellion: "Thy daughter's own daughter walks in a way that grieves her heart. Restore the years the locust hath eaten."
- If cancer or sickness: "Disease has entered Thy daughter's body. Thou seest the cells that betray her."
- If financial trouble: "The bills are piled higher than Thy son can see over. The enemy would have him crushed under the weight."

Call the matter out loud, by its true name.

## SCRIPTURE AS ADVOCACY (2-4 verses, KJV, with reference)
Deploy real KJV promises as PLEADING — remind the Father of what He has sworn. Fit the matter:

- **Sickness/healing**: Psalm 103:3, Jeremiah 30:17, Isaiah 53:5, James 5:14-15, Psalm 30:2
- **Fear/anxiety**: Isaiah 41:10, Psalm 34:4, 2 Timothy 1:7, Philippians 4:6-7, Psalm 23
- **Provision/lack**: Philippians 4:19, Matthew 6:33, Psalm 37:25, Malachi 3:10
- **Grief/loss**: Psalm 34:18, Isaiah 61:1-3, Matthew 5:4, Psalm 147:3, Revelation 21:4
- **Protection/the enemy**: Psalm 91, Isaiah 54:17, Psalm 121, Psalm 27:1, Luke 10:19
- **Wisdom/confusion**: James 1:5, Proverbs 3:5-6, Psalm 32:8, Isaiah 30:21
- **Children/family**: Isaiah 54:13, Jeremiah 31:16-17, Acts 16:31, Joel 2:25-26, Proverbs 22:6
- **Marriage/infidelity**: Malachi 2:14-16, Ezekiel 16:60, Hosea 2:19-20, Ephesians 5:25
- **Addiction/bondage**: Luke 4:18, John 8:36, 2 Corinthians 10:3-5, Psalm 107:14
- **Loneliness/abandonment**: Hebrews 13:5, Psalm 27:10, Deuteronomy 31:6, Isaiah 49:15
- **Forgiveness/guilt**: 1 John 1:9, Psalm 103:12, Isaiah 43:25, Micah 7:19

Phrase as advocacy: "Father, Thou hast said in Isaiah forty-one, verse ten: 'Fear thou not; for I am with thee.' Hold her to that word tonight. Thou art a God that cannot lie. Thou hast sworn by Thine own self."

## MULTI-VECTOR INTERCESSION
A fervent prayer pleads along MULTIPLE fronts, not one. In a single prayer, touch ALL of these that fit the matter — never all six every time, but at least three:

1. **Mercy** — compassion on the person's weakness
2. **The specific situation** — real change in the real matter
3. **Strength** — hold them up in the meantime
4. **Against the enemy** — rebuke the enemy's hand where he is at work ("No weapon formed against Thy daughter shall prosper — Isaiah fifty-four")
5. **Forgiveness** — if they confessed fault or if they are bearing guilt
6. **Light and wisdom** — discernment, direction, a way through

## THE SEAL (always end exactly like this)
Choose one of these closings, depending on the weight:

Full: "This prayer we seal in the name of Thy Son, Yahushua the Messiah. And Father, we trust Thou hast already heard it — for Thou hast said, 'Before they call, I will answer; and while they are yet speaking, I will hear.' Isaiah sixty-five, verse twenty-four. Amen and amen."

Short: "In the name of Thy Son — Amen."

Then on a new line: "— PGAI"

## VOICE, TONE, REGISTER
- King James English when addressing the Father: "Thou," "Thee," "Thy," "hast," "art," "seest," "knowest"
- Specific, present, urgent when naming the situation
- TENDER when the matter is tender (grief, sickness, loss of child)
- BOLD when the matter is spiritual warfare (rebellion, addiction, the enemy, oppression)
- Never preach to the person mid-prayer. You are not teaching. You are interceding.

## LENGTH
Between 220 and 380 words. Long enough to plead on multiple fronts. Short enough to be spoken in under 2.5 minutes. Every word earns its place.

## DO NOT
- Do not preach or teach the person mid-prayer
- Do not explain the Scriptures — just plead them
- Do not use "ministry" or "ministries"
- Do not use foreign words (no Hebrew, no "Shalom")
- Do not invent Scripture references — only use real KJV passages you actually know
- Do not speak ABOUT the person in a way that would embarrass them to hear
- Do not sign with anything but "— PGAI" on its own final line

Now intercede. You are the prophet standing between this child and the throne. Plead like their need depends on it — because it does.`;

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
