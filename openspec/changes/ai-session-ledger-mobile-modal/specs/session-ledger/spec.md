## ADDED Requirements

### Requirement: AI-Generated Session Ledgers

The application MUST generate per-session ledgers using OpenAI when `OPENAI_API_KEY` is configured.

#### Scenario: Session creation

- **WHEN** a POST to `/api/session` is made
- **THEN** the server creates a unique session with a random number of transactions (4-7)
- **AND** returns a SHA-256 hash of the transactions.

### Requirement: Removal of Static Ledger

The global static ledger `LEDGER_TRANSACTIONS` MUST be removed from `lib/ledger.ts`.

#### Scenario: Legacy code removal

- **WHEN** developer checks `lib/ledger.ts`
- **THEN** no `LEDGER_TRANSACTIONS` constant exists.
- **AND** `getLedger()` throws an error or is removed.

## MODIFIED Requirements

### Requirement: Decision Logic Evaluation

The `/api/decision` response MUST include detailed evaluation data for player education.

#### Scenario: Decision evaluation feedback

- **WHEN** a decision is submitted
- **THEN** the response includes `evaluation.explanation` and `evaluation.basis`.

## ADDED Requirements

### Requirement: Automated Decision Modal

The system MUST auto-open a detailed decision modal after a regulator makes a choice.

#### Scenario: Auto-open modal

- **WHEN** the regulator clicks 'Release' or 'Reject'
- **THEN** the `DecisionModal` appears automatically with evidence.

### Requirement: Mobile Viewport Lock

The application MUST prevent mobile zoom on input focus using viewport meta tags.

#### Scenario: Input focus behavior

- **WHEN** focusing an input on a mobile device
- **THEN** the screen scale remains at 1.0.
