# Proposal: Make app mobile-first and session-ledger support

**Change ID:** make-mobile-first-app

## Summary

Make CTG mobile-first and responsive from the ground up, implement session-scoped random ledger generation per game session, provide a secure server-side mechanism for injecting the claimant system prompt and accept (server-side) OpenAI API key configuration, and adopt a light white background with primary color #005D9F.

This is a focused, minimal plan to make the app usable on phones/tablets, and to support the game dynamic where ledger transactions vary every session. The change emphasizes accessibility, security (server-side secrets), and testability.

## Motivation

- The game is primarily played on mobile/tablet devices. A mobile-first UX will improve participant experience and demo effectiveness.
- Randomized, per-session ledger snapshots make each play-through unique and better demonstrate the regulator's role in verification.
- System prompt and API key must be managed server-side to prevent leakage and ensure the claimant agent cannot access the ledger state.

## Scope

- UI: Mobile-first layout, touch-friendly controls, theme variables (bg: light white, primary: #005D9F), responsive layouts for mobile → tablet → desktop.
- Ledger: Implement per-session ledger generation and immutability for the session; ledger url or token to fetch read-only snapshot.
- AI: Server-side enforcement for system prompt (configurable via env / admin UI) and require API key in server env. The chat route will accept per-session claim data but the agent will not be able to access ledger state.
- Tests: Unit + integration tests for ledger generation, hash integrity, API enforcement, and basic mobile rendering checks.

## Risks & Mitigations

- Risk: Session-based ledger state could be mutable by mistake. Mitigation: keep ledger server-side, generated once per session and stored in-memory or session store; expose read-only snapshot endpoint.
- Risk: API key leakage if used in client. Mitigation: never include API keys client-side; require server proxy.

## Acceptance Criteria

- App UI renders in mobile-first layouts and is usable on phones and tablets.
- Ledger snapshot differs per session and remains immutable for that session; ledger hash is displayed.
- Claimant AI system prompt is configurable server-side; AI never receives ledger truth.
- Tests exist that validate ledger generation, API constraints, and responsiveness critical paths.
