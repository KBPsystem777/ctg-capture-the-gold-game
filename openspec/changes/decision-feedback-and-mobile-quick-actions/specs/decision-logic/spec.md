## ADDED Requirements

- When a player submits a decision (Release/Reject) for a claim, the server must return an `evaluation` object containing at minimum:
  - `regulatorCorrect` (boolean)
  - `message` (string) — a short status message
  - `explanation` (string) — a concise educational explanation of why the decision is correct or incorrect referencing ledger evidence
  - `basis` (object) — machine-friendly detail such as `matchedFields` and `closestMatches` for educational feedback

#### Scenario: Correct approval

Given a session ledger contains a transaction that matches the claim on weight, date, and location
When the player selects `Release` on the claim
Then the response must include `evaluation.regulatorCorrect === true` and an `explanation` describing which fields matched and the matching transaction id.

#### Scenario: Incorrect approval

Given the session ledger does not contain a matching transaction
When the player selects `Release` on the claim
Then the response must include `evaluation.regulatorCorrect === false` and an `explanation` describing lack of match and any close matches.

## MODIFIED Requirements

- The UI must immediately reveal the evaluation and explanation after the first successful API response (no second-click required).

#### Scenario: Immediate reveal

Given a player clicks `Release` once
When the API returns the evaluation
Then the UI must display the result and the `explanation` without additional user action.

- On mobile screens (viewport `lg:hidden`) the app must surface approve/reject actions via a quick-action bar that calls the same API and shows loading state.

#### Scenario: Mobile quick action

Given a mobile user is on the main play view
When they tap `RELEASE` on the quick action bar
Then the app must call the decision API and reveal the evaluation and explanation as per other flows.
