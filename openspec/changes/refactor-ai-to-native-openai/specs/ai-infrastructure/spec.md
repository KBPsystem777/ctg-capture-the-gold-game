# Spec: Native AI Infrastructure

## MODIFIED Requirements

### Requirement: AI Library Usage

The application SHALL use the native `openai` library for all LLM interactions in the chat service, removing the Vercel AI SDK dependency.

#### Scenario: Chat Message Processing

- Given a valid chat request with transaction context
- When the API processes the request
- Then it SHALL use the `openai` library to generate a response.
- And it SHALL return a valid JSON object matching the internal game schema.

### Requirement: Role Continuity

The system SHALL maintain consistent role terminology internally while mapping to OpenAI's restricted role set for API calls.

#### Scenario: Role Mapping in Native Call

- Given an internal message with role "regulator"
- When sending to OpenAI
- Then the role MUST be mapped to "user".
- Given an internal message with role "claimant"
- When sending to OpenAI
- Then the role MUST be mapped to "assistant".
