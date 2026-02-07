# Design: Decision Feedback & Mobile Quick Actions

## Background

Players must make a release/reject decision based on the read-only ledger. Currently, when they submit a decision the UI requires a second click to show the result because evaluation state lives in the `DecisionPanel` and is not passed to the parent when swapping components to show the final state. Also, players receive only a pass/fail message and no explanation of why a decision is correct or incorrect. Mobile users must navigate to a separate Verify tab to act.

## Design Decisions

1. Single Source of Truth for Evaluation: Lift the evaluation state and loading state to `GameContainer`. That fixes the double-click bug because the parent will pass evaluation into the newly mounted `DecisionPanel` instance that displays results.

2. Decision Explanation: The server will return an `explanation` string and a `basis` object containing the matching ledger transaction id and which fields matched (weight/date/location). This keeps the response machine-friendly and easy to present in the UI.

3. Mobile Quick Actions: Add a `QuickDecisionBar` that is fixed to the bottom of the viewport on small screens (visible `lg:hidden`). The bar will have large `RELEASE` and `REJECT` buttons consistent with the DecisionPanel styles and will reuse the parent's `submitDecision` function so logic remains DRY. After a decision is submitted via the quick bar, the UI will automatically switch the mobile Tabs to the `Verify` tab so the result and explanation are immediately visible to the user.

## Trade-offs & Alternatives

- Alternative: Keep evaluation state inside the DecisionPanel but pass it into the parent; this requires the parent to shuttle data back to the new instance and is more brittle. Lifting to the parent is simpler and more robust.
- Alternative: Use optimistic UI updates (assume release is correct before API returns). This is risky because it could misteach players; prefer explicit confirmation after server response.

## Accessibility

- Buttons must be large and have sufficient contrast; the QuickDecisionBar will use `aria-label` and be keyboard accessible.

## Metrics

- Post-release: reduction in double-click occurrences, faster decision reveal.
- Engagement: increased mobile decisions per play-through due to lowered friction.
