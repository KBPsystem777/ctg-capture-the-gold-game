# Design: Native OpenAI Integration

## Architectural Overview

### 1. Client Initialization

A shared OpenAI client will be initialized, preferably in a library file (e.g., `lib/openai.ts`) if we plan to use it in multiple places, or directly in the route for now if scope is limited.

### 2. Message Transformation

The internal message structure:

```json
{ "role": "claimant" | "regulator", "content": "..." }
```

Will be mapped to OpenAI's native types:

- `regulator` -> `user`
- `claimant` -> `assistant`

### 3. Structured Outputs (JSON Mode)

Using OpenAI's `response_format: { type: "json_object" }` or `response_format: zodResponseFormat(...)` to ensure the response matches the required schema:

```json
{ "response": "string" }
```

### 4. Logic Flow

1. Receive request with `messages` and `claim`.
2. Construct `system_prompt` with claim details.
3. Map `messages` to OpenAI format.
4. Call `openai.chat.completions.create`.
5. Parse and return JSON response.

## Trade-offs

- **Vercel AI SDK vs Native**: Moving to native removes the built-in streaming/tool-calling helpers of the Vercel SDK, but since our current use case is a straightforward JSON response, the native library is leaner and more direct.
