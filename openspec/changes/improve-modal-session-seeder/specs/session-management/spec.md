## ADDED Requirements

### Requirement: Idempotent Session Initialization

The client SHALL ensure that the game session is initialized exactly once per claim view, preventing duplicate API requests.

#### Scenario: Single request per load

- **WHEN** the `GameContainer` mounts
- **THEN** it SHALL only emit one `POST` request to `/api/session`.
- **AND** it SHALL track the initialization state to prevent re-execution during development/Strict Mode.

## MODIFIED Requirements

### Requirement: Session-Scoped Ledger

**MODIFIED**: The session ledger MUST now strictly contain transactions with locations authorized by the BSP (Minahang Bayan).

The ledger generation MUST be tied to a specific session ID to ensure data integrity and prevent cross-session leaks.

#### Scenario: Location validation

- **WHEN** a session is created
- **THEN** all generated transactions MUST have a `location` corresponding to a valid Philippine gold-producing region.
