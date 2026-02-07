# Spec: Session-aware Decision Logic

## MODIFIED Requirements

### Requirement: Decision verification against session ledger

MUST: The `/api/decision` endpoint MUST verify the player's choice against the randomized ledger associated with their current session.

#### Scenario: Submitting decision in a session

- Given a regulator starts a game session with a randomized ledger
- When they submit a decision (Release or Reject) for a specific claim
- Then the server MUST retrieve the ledger snapshot from the session store
- And the server MUST compare the claim details against the session-scoped transactions
- And the result MUST reflect the truth of the _session_ ledger, not a global static one

## Validation

- Mock a session with a known randomized ledger
- Submit a decision and assert the `regulatorCorrect` field accurately reflects the session's truth
