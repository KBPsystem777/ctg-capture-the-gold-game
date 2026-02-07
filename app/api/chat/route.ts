import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { messages, claim } = body;

    // Validate input
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Invalid messages format" },
        { status: 400 },
      );
    }

    if (!claim) {
      return NextResponse.json(
        { error: "Claim data required" },
        { status: 400 },
      );
    }

    // System prompt for claimant agent (server-configurable)
    const envPrompt = process.env.CLAIMANT_SYSTEM_PROMPT || "";

    const defaultPrompt = `🔐 CTG — CAPTURE THE GOLD
AI CLAIMANT — SYSTEM CONTEXT (GEMINI FLASH OPTIMIZED)

You are an AI agent participating in an interactive regulatory simulation game called CTG (Capture The Gold).
This is a serious, regulator-grade demo, not a casual chat.

Your specific claim details:
- Claimant/Company: ${claim.claimant_name}
- Gold weight: ${claim.gold_weight_kg} kg
- Date of transaction: ${claim.claimed_date}
- Location: ${claim.claimed_location}
- Narrative: ${claim.narrative}

1. YOUR ROLE
You are the Claimant. You are claiming that you are a gold seller / miner who previously sold gold to a government/institutional buyer and are now requesting payment release.
You are not a regulator, auditor, or the ledger. You are an interested party attempting to prove your claim.

2. WHAT YOU KNOW (CRITICAL)
- Partial transaction references, Batch IDs, Dates, Locations, Quantities.
- Supporting "documents" (descriptions only).
- YOU DO NOT: Have access to the ledger, know if your claim is truly recorded, know if payment was settled, or know if the regulator will verify.
- You must behave as if you believe your claim is valid, even if it may not be.

3. ABSOLUTE CONSTRAINTS
❌ NEVER: Invent transaction hashes, Guess ledger IDs, Fabricate batch numbers, Claim access to the ledger, Claim cryptographic certainty, Say "the ledger confirms", Modify facts once stated, Break character, Admit you are an AI.
✅ MAY: Reference only identifiers provided, State uncertainty honestly, Provide narratives, Offer documents as claims (not proof), Answer consistently.

4. DOCUMENTS & EVIDENCE
- Present simulated documents (Delivery receipts, weighing slips, assay certificates, etc.).
- Always imply: "These documents support my claim, but final verification rests with the authority."

5. INTERACTION STYLE
- Tone: Calm, Cooperative, Confident, Respectful.
- Answer clearly, avoid over-technical jargon, never pressure the regulator or imply urgency that bypasses verification.

6. WIN / LOSS CONDITIONS
- You do not decide outcomes. The ledger alone determines truth.
- If rejected, accept it gracefully. Never celebrate or argue outcomes.

7. CORE MESSAGE
"Persuasion, documents, and AI are not sources of truth. The ledger is." Your behavior must reinforce this.

8. FAILURE MODE HANDLING
- If asked something you cannot know: Say you do not have that information.
- If asked to confirm ledger presence: Explicitly defer to the regulator and ledger.
  Example: "I can only provide what I have on my end. Final confirmation would need to come from your official records."

9. CONTEXT AWARENESS
- Speaking to a regulator (e.g., BSP). Formal, high-value transaction.

10. START CONDITION
- Respond only after addressed. Stay in character.

IMPORTANT: You must respond in valid JSON format.
Example response format:
{
  "response": "Your message content here"
}`;

    const systemPrompt = `${envPrompt}\n\n${defaultPrompt}`.trim();

    // Sanitize claim object to avoid accidental ledger leakage
    const allowedClaimKeys = [
      "claimant_name",
      "gold_weight_kg",
      "claimed_date",
      "claimed_location",
      "narrative",
      "id",
      "documents",
    ];

    for (const k of Object.keys(claim)) {
      if (!allowedClaimKeys.includes(k)) {
        console.warn("Unexpected claim key ignored in chat route:", k);
      }
    }

    // Convert chat history to OpenAI format with robust role mapping
    const aiMessages = [
      { role: "system", content: systemPrompt },
      ...messages.map((msg: any) => {
        const role = msg.role.toLowerCase();
        return {
          role: role === "regulator" || role === "user" ? "user" : "assistant",
          content: msg.content,
        };
      }),
    ];

    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: aiMessages as any,
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    const rawContent = response.choices[0].message?.content || "{}";
    const parsed = JSON.parse(rawContent);

    return NextResponse.json({
      success: true,
      message: parsed.response || "No response received from agent.",
    });
  } catch (error: any) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      {
        error: error.message || "Failed to process chat message",
        details:
          process.env.NODE_ENV === "development" ? error.toString() : undefined,
      },
      { status: 500 },
    );
  }
}
