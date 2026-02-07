# Design Notes — formalize-ledger-priority

## Session Isolation in Decision Making
To prevent the "static ledger" bug where a user sees one ledger but is judged against another, the `/api/decision` endpoint MUST use the same session retrieval logic as `/api/ledger`.
- It will read the `ctg_session` cookie.
- It will pull the specific `LedgerTransaction[]` array for that user.
- The `verifyTransaction` function will be updated or a helper will be created to accept a specific transaction list instead of using the global constant.

## Trust Hierarchy UI
The goal is to reinforce the lesson:
> "AI talks, documents persuade, but only the ledger decides."
The `DecisionPanel` will render a visual comparison table in the "Outcome Reveal" state:
- Layer: Human/AI | Documents | Ledger
- Can Persuade: Yes | Yes | No
- Can Lie: Yes | Yes | No
- Can Decide: No | No | Yes

This makes the abstract concept concrete immediately after the user makes potentially the "wrong" choice based on a persuasive AI message.

## AI Persona: "The Persuasive Agent"
The system prompt will be tuned to be "legitimate-sounding" but strictly prohibited from accessing ledger data. This ensures that when the AI is wrong (the claim isn't in the ledger), it isn't "stupid"—it just has an incomplete/wrong view because it is off-ledger.

## Verification
`lib/session-ledger.ts` is the single source of truth for the game state during a session. All endpoints (`/api/ledger`, `/api/decision`, and eventually any analytics) must refer back to this module to ensure consistency.
