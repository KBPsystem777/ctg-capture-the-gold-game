# Tasks: AI Session Ledger, Mobile Zoom Fix, Decision Modal

1. Proposal & Validation
   - [x] Create proposal.md, design.md, spec delta skeletons.
   - [x] Validate proposal with `openspec validate` and resolve issues.

2. AI Session Ledger (Remove static ledger)
   - [x] Remove `LEDGER_TRANSACTIONS` from `lib/ledger.ts`.
   - [x] Ensure `getLedger()` either returns session-aware data or is removed. Update callers.
   - [x] Ensure `session-ledger` is the canonical generator and is robust (OpenAI calls, parsing, fallback deterministic generator).
   - [x] Add server-side unit tests to mock OpenAI and verify `POST /api/session` stores a session with a `transactions` array and `hash`.
   - [x] Update any tests that relied on the static ledger.

3. Mobile Zoom Fix
   - [x] Add viewport meta in `app/layout.tsx`: `initial-scale=1, maximum-scale=1` using Next.js 15+ `export const viewport` convention.
   - [x] Add a short note in docs about accessibility trade-offs.
   - [x] Add a small automated test for the session integrity.

4. Decision Modal & UI
   - [x] Add a `DecisionModal` component with visual feedback, matching badges, and session tracking.
   - [x] Auto-open the modal when a decision has been evaluated in `GameContainer`.
   - [x] Add a persistent CTA in `DecisionPanel` to re-open the modal.
   - [x] Add visual iconography to mobile Tabs for better UX.
   - [x] Implement `sessionLoading` state to prevent race conditions during initialization.

5. Tests & Docs
   - [x] Update unit tests and integration tests to reflect the new behaviors.
   - [x] Update `README` to note the ledger removal and trust hierarchy concept.

6. Release
   - [ ] Merge changes behind a single change-id and deploy to staging.
   - [ ] Verify flows on mobile and desktop, including accessibility checks.
