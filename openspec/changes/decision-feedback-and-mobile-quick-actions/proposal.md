# Proposal: Decision Feedback & Mobile Quick Actions

Change-id: decision-feedback-and-mobile-quick-actions

## Summary

Address three related UX issues that affect the decision flow and educational value of CTG:

1. Fix the existing bug where the UI requires a second click to reveal the decision result (double-click to reveal). This is caused by evaluation state being stored locally in the decision component and lost when a new component instance is mounted to show the result.

2. Add an explanation for why the user's decision was correct or incorrect. The API should return a clear, educational explanation that references ledger evidence and guiding principles.

3. Provide a mobile-only quick-action bar so users can approve/reject directly from the main play view without navigating to the Verify tab.

## Goals

- Immediate fix for the double-click issue.
- Provide educational explanations (human-readable, referencing ledger fields) when a decision is evaluated.
- Improve mobile ergonomics and reduce friction when making decisions.

## Constraints

- Keep changes minimal and well-scoped.
- Preserve existing server-side decision logic semantics (successful decision returns same evaluation semantics plus new explanation field).
- Ensure mobile quick-action bar is accessible and consistent with design system.

## Deliverables

- OpenSpec artifacts (proposal, tasks, design rationale, spec deltas).
- Code changes:
  - API: enhance `/api/decision` to include `explanation` and `basis` in the response.
  - UI: lift evaluation state to `GameContainer` so the result is shown immediately after first click.
  - UI: add `QuickDecisionBar` component for mobile with Release/Reject buttons.
  - Update `DecisionPanel` to be controlled (receive `evaluation` and `loading` from parent).
- Unit tests for `/api/decision` and `session` behaviour for the new fields.
- Small e2e or integration smoke test that clicking the quick bar reveals the decision result and explanation.
