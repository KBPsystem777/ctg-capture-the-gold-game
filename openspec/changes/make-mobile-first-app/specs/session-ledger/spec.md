# Spec: Session-scoped Ledger Generation

## ADDED Requirements

### Requirement: Session-scoped ledger generation and immutability

MUST: Each game session MUST have a distinct, immutable ledger snapshot generated server-side.

#### Scenario: New session ledger generation

- Given a new session is created (on first visit or explicit session creation)
- When the server generates the ledger
- Then a snapshot containing N transactions is created and stored for that session
- And a SHA-256 hash of the canonical JSON is computed and saved

#### Scenario: Ledger immutability within session

- Given a session with a generated ledger
- When the client requests the ledger for the same session id
- Then the server must return the exact same transactions and hash
- And the ledger cannot be modified during the session

#### Scenario: Verify transaction exists

- Given a ledger snapshot for a session
- When the regulator supplies a claim (weight, date, location)
- Then `verifyTransaction` returns a matching transaction if present

## Validation

- Unit tests cover generation, hash computation, and `verifyTransaction` behavior
- An integration test validates that repeated `GET /api/ledger?session=<id>` returns identical payload and hash
