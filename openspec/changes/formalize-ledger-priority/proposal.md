# Proposal: Formalize Ledger Priority and Outcome Reveal

**Change ID:** formalize-ledger-priority

## Summary

Align the game logic and UI with the "only the ledger decides" philosophy. This includes making the decision API session-aware (checking the randomized ledger), enhancing the outcome reveal with the trust hierarchy lesson, and ensuring the claimant AI behavior is strictly persuasive but ledger-blind.

## Motivation

The current `/api/decision` route checks against a static ledger, ignoring the session-scoped ledger actually shown to the player. To maintain the educational "source of truth" lesson, every part of the system must respect the session-specific ledger. Additionally, the outcome reveal needs to be more impactful to reinforce the trust hierarchy.

## Scope

- **API:** Update `/api/decision` to fetch the session-scoped ledger from `lib/session-ledger.ts` using the session cookie.
- **UI:** Enhance `DecisionPanel` to display the "Trust Hierarchy" lesson (Human/AI, Documents, Ledger) clearly in the outcome reveal.
- **AI:** Refine the claimant system prompt to emphasize the "uncomfortable" and "persuasive" nature of the role while strictly forbidding ledger access.
- **Integration:** Ensure the game flow (End-to-End) matches the new formal documentation.

## Acceptance Criteria

- Decisions are verified against the specific ledger snapshot the player sees in their current session.
- The outcome reveal shows whether the regulator was correct and explains WHY (Ledger > AI/Docs).
- The AI claimant successfully defends claims using only narratives and "simulated documents" without referencing real ledger data.
- All core requirements in the updated `openspec/project.md` are met.
