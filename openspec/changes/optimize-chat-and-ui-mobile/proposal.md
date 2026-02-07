# Proposal: Optimize Chat and UI for Mobile

## 1. Problem Statement
The current simulation has several mobile UX issues and a potential reliability issue with the Chat API:
1.  **Chat UI**: The chat container is too long (`min-h-96`), forcing excessive scrolling on mobile.
2.  **Decision UI**: The decision panel and trust hierarchy table are not optimized for narrow screens.
3.  **Chat Persona**: The claimant AI agent needs a more rigorous and "Gemini Flash optimized" system prompt to maintain the "Ledger is Truth" philosophy.
4.  **API Reliability**: The current Chat API might fail due to missing provider configurations or incorrect message routing when called via external tools (e.g., curl).

## 2. Proposed Solution
1.  **Tabbed Mobile Layout**: Introduce a tab-based navigation for the `GameContainer` on mobile devices to switch between "Details" (Claim), "Chat", and "Ledger/Decision".
2.  **Compact Chat UI**: Refactor `ChatPanel` to use `flex-1` appropriately without hardcoded minimum heights that break mobile flow.
3.  **Mobile-First Decision Table**: Update the Trust Hierarchy table to use a more responsive layout (e.g., vertical cards or horizontal scroll) on small screens.
4.  **Prompts Overhaul**: Update `app/api/chat/route.ts` with the "🔐 CTG — CAPTURE THE GOLD" instruction set.
5.  **Model Optimization**: Ensure the API uses a robust model configuration and handles specific claimant/regulator roles correctly.

## 3. Impact
- **UX**: Improved accessibility on mobile devices.
- **Immersion**: More consistent and "uncomfortable" (educational) AI advisor persona.
- **Reliability**: Validated API endpoints for developer/tooling access.

## 4. Risks & Mitigations
- **Risk**: Tabbed layout might hide the Ledger from the user while chatting.
- **Mitigation**: Use indicators or notifications when the Ledger changes, and ensure the "Decision" action is visible or easily accessible.
