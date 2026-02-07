# Design: Mobile-First Game UI & Prompt Engine

## Architectural Overview

### 1. Mobile-First Tabs (`GameContainer`)

On screens smaller than `md`, the `GameContainer` will switch from a grid layout to a `Tabs` navigation.

- **Tab 1: Claim**: Contains `ClaimPanel`.
- **Tab 2: Chat**: Contains `ChatPanel`.
- **Tab 3: Verify**: Contains `LedgerPanel` and `DecisionPanel`.

### 2. Chat Layout Refactor

- Remove `min-h-96` from `ChatPanel`.
- Use `h-[calc(100vh-250px)]` or similar viewport-aware sizing on mobile to ensure the input is always visible without scrolling through the whole page.
- Implement a better "is typing" indicator that matches the institutional tone.

### 3. Responsive Decision Table

- On mobile, the "Trust Hierarchy" table in `DecisionPanel` will switch to a stacking layout or use a horizontal scroll area with a fixed "Layer" column.
- Buttons (Release/Reject) will be full-width on mobile for better touch targets.

### 4. Prompt Engine logic (`app/api/chat/route.ts`)

- Replace the current template with the provided 10-point instruction set.
- Ensure the `claim` object passed to the AI is strictly sanitized to prevent leakage of the "actual" transaction status (which the claimant shouldn't know).
- Use `google/gemini-1.5-flash` model if possible, or maintain OpenAI with the updated instructions.

## Trade-offs

- **Tabbed vs Stacking**: Stacking is simpler but "too long" as per user feedback. Tabs reduce cognitive load but hide context. We will prioritize Tabs for mobile to solve the "too long" problem.
