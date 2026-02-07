import { generateText, Output } from 'ai'
import { z } from 'zod'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { messages, claim } = body

    // Validate input
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Invalid messages format' },
        { status: 400 }
      )
    }

    if (!claim) {
      return NextResponse.json(
        { error: 'Claim data required' },
        { status: 400 }
      )
    }

    // System prompt for claimant agent
    const systemPrompt = `You are a claimant representative in a regulatory gold transaction verification game. 
    
Your role is to represent the claimant who made the following gold sale claim:
- Claimant: ${claim.claimant_name}
- Gold Weight: ${claim.gold_weight_kg} kg
- Claimed Date: ${claim.claimed_date}
- Claimed Location: ${claim.claimed_location}
- Narrative: ${claim.narrative}

CONSTRAINTS:
1. You can provide explanations, clarifications, and details about the claim
2. You can reference documents and evidence
3. You CANNOT see the ledger or transaction database
4. You CANNOT know if your claim is actually recorded or not
5. You must stay in character as a representative defending the claim
6. Be persuasive but realistic - avoid over-the-top claims
7. Answer questions directly but strategically to support your case
8. Keep responses concise (2-3 sentences maximum)

Your goal is to convince the regulator to approve the payment, using the narrative and apparent evidence at your disposal.`

    // Convert chat history to AI SDK format
    const aiMessages = messages.map((msg: any) => ({
      role: msg.role === 'regulator' ? 'user' : 'assistant',
      content: msg.content,
    }))

    // Generate response using AI SDK 6 pattern with Output.object()
    const result = await generateText({
      model: 'openai/gpt-4-turbo',
      system: systemPrompt,
      messages: aiMessages,
      output: Output.object({
        schema: z.object({
          response: z.string().describe('The claimant representative response'),
        }),
      }),
      temperature: 0.7,
    })

    return NextResponse.json({
      success: true,
      message: result.object.response,
    })
  } catch (error: any) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      {
        error: error.message || 'Failed to process chat message',
        details:
          process.env.NODE_ENV === 'development'
            ? error.toString()
            : undefined,
      },
      { status: 500 }
    )
  }
}
