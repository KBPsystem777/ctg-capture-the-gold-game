# Proposal: AI-Session Ledger, Mobile Zoom Fix, and Decision Modal

Change-id: ai-session-ledger-mobile-modal

## Summary

This proposal makes three coordinated changes to improve game fidelity, mobile UX, and player education:

1. Replace the static, hard-coded `LEDGER_TRANSACTIONS` with AI-generated, per-session ledgers. The static snapshot in `lib/ledger.ts` will be removed so the ledger is always session-specific and generated on demand.

2. Fix a mobile UI zoom bug that occurs while typing in inputs by adding a viewport meta change to prevent automatic zooming when inputs are focused (user-requested approach).

3. Add an auto-opening decision _explanation modal_ after any decision is evaluated. The modal will show a clear, structured explanation and a side-by-side comparison of the claimant's claim vs the authoritative ledger transaction (if any), stressing that "the ledger is the source of truth."

## Rationale

- The session-by-session ledger model is core to the simulation and encourages replayability and integrity: each play-through should have its unique immutable ledger snapshot.
- Mobile input zoom disrupts the user flow and is a common mobile UX issue. The team chose the viewport meta solution (max-scale=1) to ensure consistent visual scale during and after input focus.
- A modal explanation provides an educational, unmissable reinforcement of the Trust Hierarchy: it explains _why_ a decision is correct/incorrect, and references the ledger evidence.

## Constraints & Guardrails

- The change should not break existing flows. Clean migration steps and tests will be included.
- No partial or ambiguous behaviors: the static ledger file will be deleted as requested; session-ledger (AI-driven) will be the authoritative source.
- Accessibility trade-offs for the viewport change will be documented and explained in the design doc.

## Deliverables

- OpenSpec artifacts: `proposal.md`, `design.md`, task list and spec deltas.
- Code changes (apply stage): remove `LEDGER_TRANSACTIONS`, update `lib/ledger.ts` to only export helpers and rely on `session-ledger` for session transactions; ensure OpenAI-per-session ledger generation is robust; add viewport meta updates in `app/layout.tsx`; add an auto-opening `DecisionModal` UI and hooks in `GameContainer`.
- Tests: unit + integration tests for AI-generated session ledgers, decision modal behavior, and mobile UI regression checks.

## Next steps

- Validate this proposal (`openspec validate <id> --strict`) and incorporate any feedback.
- After approval, implement the changes in the apply stage in small, testable steps (session ledger removal, layout change, decision modal UI, tests).
