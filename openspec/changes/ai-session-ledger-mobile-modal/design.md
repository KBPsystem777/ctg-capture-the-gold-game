# Design: AI Session Ledger, Mobile Zoom Fix, Decision Modal

This document captures the architectural decisions, trade-offs, and implementation guidance.

1. AI-Generated Session Ledger (remove static snapshot)

---

- Goal: Ensure every play-through has a unique, immutable ledger generated per session.
- Approach: Use the existing `session-ledger` pattern and the OpenAI-backed generator previously prototyped. The flow:
  1. `POST /api/session` creates a session and generates a random-sized ledger (4-7 transactions) via OpenAI or a robust local generator.
  2. The server stores the session with its transactions and a SHA-256 `hash` for integrity.
  3. `GET /api/ledger` or `/api/decision` will reference the session transactions—no global static ledger is used.
- Implementation detail: Delete `LEDGER_TRANSACTIONS` from `lib/ledger.ts`. Keep `verifyTransactionInList` as a generic helper that operates on a transaction array passed in (no change needed).
- Race Condition Mitigation: `GameContainer` now implements a `sessionLoading` state. It waits for the `POST /api/session` to complete before rendering the main application tabs and components. This ensures that any component fetching the ledger (like `LedgerPanel`) finds the session cookie already set.
- Mobile UX Enhancements:
  - Added icons and clean labels to `Tabs` for easier navigation.
  - Implemented a floating `QuickDecisionBar` that is hidden once a result is shown to avoid clutter.
  - Set `maximum-scale=1` in `RootLayout` viewport to prevent disruptive mobile zoom on input focus.
- Edge cases:
  - OpenAI reliability: If the OpenAI API fails, the server should return a deterministic fallback generator (seed-based) OR fail the session creation cleanly. Per your instruction, we will remove the static snapshot entirely; however we will provide a deterministic fallback generator with internal randomness to avoid hard server errors when OpenAI is unreachable.
  - Auditability: keep the session `hash` and attach it to the UI so players can verify the session ledger immutability.

2. Mobile Zoom Fix

---

- Problem: On some mobile browsers, focusing an input triggers automatic zoom and the viewport does not automatically return after blur—resulting in a poor UX.
- Chosen solution: Add a viewport meta tag change in `app/layout.tsx`:
  - `meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1"`
  - This prevents the browser from auto-scaling when inputs receive focus.
- Trade-offs & Accessibility: Disabling zoom (maximum-scale=1) reduces the ability for users to pinch-zoom. This is less ideal for accessibility. Document the trade-off and consider optionally enabling an accessibility mode later. Alternatively, if accessibility is prioritized over a strict UI behavior, switch to ensuring input elements use font-size ≥16px to avoid zoom.

3. Decision Modal (auto-open)

---

- Goal: Provide a clear, educational modal immediately after a decision to explain why the choice was correct/incorrect using ledger evidence.
- Content requirements:
  - Title: "Decision explanation"
  - Verdict: "Correct"/"Incorrect" with short summary (from `evaluation.message`).
  - Evidence block (if transaction found): show the matched transaction id, fields that matched (weight/date/location), and the ledger `hash` for the session.
  - Side-by-side comparison: Claim (left) vs Ledger (right) with highlighted matched fields.
  - Closing lesson: One-sentence emphasis: "The ledger is the source of truth in this simulation."
- Behavior:
  - Auto-open when the decision completes and `evaluation` is present, both on desktop and mobile.
  - Allow users to close the modal and re-open it via a small persistent CTA (“Why this result?”) in the Decision panel.

4. Test & Validation Strategy

---

- Unit tests: verify session creation calls OpenAI (mock), validate returned transactions are parsed and saved, and verify the server provides `explanation` and `basis` fields in `/api/decision` responses.
- Integration tests: simulate the full flow: create session, view ledger, submit decision (correct and incorrect cases), verify the modal auto-opens and contains correct evidence.
- Mobile regression tests: check the viewport meta exists, and run a light smoke test to confirm input focus does not cause persistent zoom in modern mobile browsers.

5. Rollout & Migration

---

- Apply the changes in three small PRs: (A) AI session ledger + session API tests, (B) Decision modal UI and tests, (C) Mobile viewport change + docs.
- Notify in README/CHANGELOG about the removal of the static global ledger and how to verify session hashes.
