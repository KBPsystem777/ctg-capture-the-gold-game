# Proposal: Refactor AI Layer to Native OpenAI Library

## 1. Problem Statement

The current implementation uses the Vercel AI SDK (`ai` package) which, while powerful, introduces an additional abstraction layer. The user wants to move to the native `openai` library to have direct control over LLM interactions and simplify the technology stack by removing the Vercel-specific dependency for core chat logic.

## 2. Proposed Solution

1.  **Dependency Swap**: Install `openai` package and remove `ai` (and any related sub-packages if present) from `package.json`.
2.  **API Refactoring**: Rewrite `app/api/chat/route.ts` to use `openai.chat.completions.create` instead of `generateText`.
3.  **Structured Output**: Replace `Output.object` (Vercel SDK) with OpenAI's native JSON mode or function calling (Structured Outputs) to ensure the AI returns the expected JSON schema.
4.  **Preserve Philosophy**: Ensure the complex system prompt (🔐 CTG — CAPTURE THE GOLD) and sanitization logic are perfectly preserved in the new implementation.

## 3. Impact

- **Maintenance**: Simplifies the dependency graph.
- **Flexibility**: Provides direct access to OpenAI-specific features not always exposed by abstractions.
- **Consistency**: Retains the existing chat behavior and regulator/claimant interface.

## 4. Risks & Mitigations

- **Risk**: Potential breaking changes in how messages are structured if not mapped correctly to OpenAI's native format.
- **Mitigation**: Maintain strict mapping logic that converts internal game roles (`claimant`, `regulator`) to OpenAI roles (`assistant`, `user`).
