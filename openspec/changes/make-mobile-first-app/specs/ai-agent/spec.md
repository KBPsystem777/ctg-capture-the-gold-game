# Spec: AI Claimant Agent Constraints

## ADDED Requirements

### Requirement: Server-side system prompt and no ledger leakage

MUST: The claimant AI system prompt MUST be configurable server-side and injected at LLM request time.
MUST: The claimant MUST never receive ledger state or any verifiable ledger truth in the prompt or messages.

#### Scenario: Server-side system prompt

- Given `CLAIMANT_SYSTEM_PROMPT` is configured in server env
- When the chat route constructs the request
- Then the server uses this prompt and appends per-session claim data (but not ledger truth)

#### Scenario: No ledger leakage

- Given a claim exists in session ledger
- When the server calls the AI provider
- Then the messages sent to the LLM must NOT include ledger transaction details or whether the claim is recorded

#### Scenario: Configurable prompt enforcement

- Given a developer or admin sets a new system prompt
- When a new chat request is made
- Then the server uses the updated prompt for all new sessions (existing sessions keep previously generated ledgers)

## Validation

- Tests assert that AI payloads do not include ledger data
- Contract tests validate the presence of `system` prompt and claim metadata but not ledger truth
