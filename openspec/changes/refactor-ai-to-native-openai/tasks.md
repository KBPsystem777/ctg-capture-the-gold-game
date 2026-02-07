# Tasks: Refactor AI to Native OpenAI

- [x] Install `openai` package
  - `npm install openai` (or pnpm equivalent)
- [x] Implement `app/api/chat/route.ts` using native `openai`
  - Initialize `OpenAI` client with `process.env.OPENAI_API_KEY`
  - Re-implement system prompt interpolation
  - Map internal message roles to OpenAI roles
  - Use `response_format` for structured JSON output
- [x] Remove `ai` dependency from `package.json`
  - `npm uninstall ai`
- [x] Verify Chat API functionality
  - Ensure the response format remains `{ success: true, message: "..." }`
  - Validate that the AI still follows the 🔐 system instructions
