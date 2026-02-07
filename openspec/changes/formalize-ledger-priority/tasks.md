# Tasks — formalize-ledger-priority

1. Session-Aware Decision Logic
   - [x] Update `app/api/decision/route.ts` to retrieve the session id from the `ctg_session` cookie.
   - [x] Use `getSession(id)` from `lib/session-ledger.ts` to verify the claim against the *session* ledger.
   - [x] Update `verifyTransaction` (or a session variant) to work with the `LedgerTransaction[]` from the session.
   - Validation: A correct decision on a randomized ledger results in `regulatorCorrect: true`.

2. Enhanced Outcome Reveal UI
   - [x] Update `components/decision-panel.tsx` result view to include the "Trust Hierarchy" table or list.
   - [x] Add explicit text confirming: "Only the ledger decides."
   - [x] Ensure the result message clearly contrasts "Persuasion" vs "Verification."
   - Validation: Player sees the hierarchy lesson after choosing "Release" or "Reject".

3. Claimant AI Refinement
   - [x] Adjust `app/api/chat/route.ts` system prompt to reinforce the "persuasive yet fallible" behavior.
   - [x] Explicitly instruct the AI to use "the provided documents" (even if simulated) as their primary defense.
   - Validation: AI responses use claim narrative and documents more aggressively.

4. Integration Polish
   - [x] Verify `GameContainer` and `LedgerPanel` are passing/using session data correctly for consistent verification.
   - [x] Audit `lib/game-state.ts` to ensure `SAMPLE_CLAIMS` are diverse and match the "uncomfortable" demo goals.
   - Validation: End-to-end flow from Claim → Chat → Ledger → Decision works with session isolation.

5. Verification Tests
   - [x] Add unit tests for the updated `/api/decision` with session mocks.
   - [x] Add a test case ensuring `verifyTransaction` correctly handles session-generated transactions.
   - Validation: `pnpm test` passes with >90% coverage on core logic.
