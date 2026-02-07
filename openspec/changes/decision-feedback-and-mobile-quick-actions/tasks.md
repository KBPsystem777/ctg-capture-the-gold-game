# Tasks

1. Proposal & Validation
   - [ ] Create `proposal.md`, `design.md`, and spec delta skeletons.
   - [ ] Validate proposal with `openspec validate` and fix issues.

2. API: Decision Explanation
   - [x] Update `app/api/decision/route.ts` to return `evaluation.explanation` and `evaluation.basis` (fields: matchedFields, closestMatches).
   - [x] Add unit tests verifying explanation generation for both matching and non-matching scenarios.

3. UI: Immediate Result Reveal
   - [x] Refactor `DecisionPanel` props to accept `evaluation` and `loading` (make it controlled) and remove internal evaluation state.
   - [x] Lift evaluation and loading state to `GameContainer` and implement `submitDecision(decision)` in parent.
   - [x] Ensure `GameContainer` passes `result` and `evaluation` to `DecisionPanel` so the result is visible immediately after the API returns.

4. UI: Mobile Quick Action Bar
   - [x] Create a `QuickDecisionBar` component for mobile that calls the parent's `submitDecision` and shows loading state.
   - [x] Add to `GameContainer` mobile layout (visible `lg:hidden`) and ensure accessibility.

5. Tests & Validation
   - [x] Add unit tests for `DecisionPanel` interaction (mock fetch) to ensure a single click reveals the result. (see `__tests__/components/game-container-decision.test.tsx`)
   - [x] Add unit test verifying quick-action buttons call API and show the explanation. (see `__tests__/components/quick-decision-bar.test.tsx`)

6. Docs
   - [ ] Update `openspec/changes/.../design.md` with reasoning and tradeoffs.
   - [ ] Update any relevant docs/instructions (play guide) to include explanation behavior.

7. Release & QA
   - [ ] Test on mobile and desktop, verify no regressions in other flows.
   - [ ] Merge and ship.
