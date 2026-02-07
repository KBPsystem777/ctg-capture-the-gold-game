# Spec: Chat Optimization & System Prompt

## MODIFIED Requirements

### Requirement: Claimant Persona

The AI Claimant SHALL strictly follow the CTG instruction set, ensuring it does not claim access to the ledger and defer to the regulator for final verification.

#### Scenario: Claimant asked about Ledger

- Given a regulator asks "What does the ledger say about this?"
- When the AI Claimant responds
- Then it must state it does not have that information and deferred to the regulator's records.
- And it must NOT invent transaction hashes or ledger IDs.

### Requirement: Mobile Chat Experience

The chat panel MUST be optimized for mobile viewports to prevent "infinite scrolling" issues.

#### Scenario: Chat on Mobile

- Given a screen width less than 768px
- When the user opens the chat tab
- Then the chat history should be contained within a viewport-relative height.
- And the input field should be easily accessible without multiple scrolls.

### Requirement: Role Mapping

The Chat API SHALL correctly map "claimant" messages to the AI assistant role and "regulator" messages to the user role.

#### Scenario: Curl request with custom roles

- Given a POST request to `/api/chat` with role "claimant" in history
- When the API processes the request
- Then it must map "claimant" to "assistant" role for the LLM.
- And it must successfully return a JSON response with the next claimant message.
