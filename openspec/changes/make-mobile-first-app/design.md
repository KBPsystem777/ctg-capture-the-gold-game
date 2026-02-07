# Design Notes — make-mobile-first-app

## Mobile-first UI

- Tailwind is inherently mobile-first; use base styles for small screens and `md:`/`lg:` for larger screens.
- Use a single-column stacked layout on phones: claim details → chat panel → ledger (collapsed by default with a clear ‘Inspect ledger’ action) → decision controls fixed at the bottom when appropriate.
- Tablet layout: two-column (chat + claim) with an expandable ledger panel or bottom sheet.
- Desktop: optional three-column layout but not prioritized.

Touch and Accessibility

- Minimum touch target: 44x44 px for interactive controls.
- Use semantic HTML and ARIA where needed; keyboard navigation support should remain.
- Ensure contrast for the chosen primary `#005D9F` and apply accessible text color (white text on primary backgrounds when appropriate).

Theming

- Add CSS variables to `globals.css` or Tailwind theme tokens for `--color-primary: #005D9F` and `--color-bg: #FBFCFD` (light white) and tie to Tailwind via `theme.extend.colors`.

## Session Ledger Generation

- Generate ledger server-side when a new session starts (on first client connection or explicit `POST /api/session`)
- Generation strategy: seed a pseudorandom generator (e.g., using crypto-randomness) to build N transactions with realistic distributions (dates within the past 12 months, random weights, locations chosen from a curated list).
- Once generated, compute SHA-256 hash of the canonical JSON representation and store in session store (in-memory store acceptable for demo; optional Redis for scale).
- Expose read-only endpoint `GET /api/ledger?session=<id>` that returns the transactions and the computed hash.
- The ledger snapshot is immutable: requests for the same session id always return the same snapshot until session expiry.

Security and Data Considerations

- Session ids must be opaque, random and unguessable (e.g., 128-bit tokens). Prefer secure, HttpOnly cookies to tie user to a session.
- The AI `system` prompt is stored server-side and injected into LLM calls; it must not contain ledger data.
- OpenAI API key stays in server env (`OPENAI_API_KEY`). Provide documentation on where to set these keys.

## AI Chat Constraints

- The chat route will be updated to accept claim data from the session and messages from the client. When calling the AI provider:
  - Use a server-side `system` prompt that contains the claim data and behavior constraints.
  - Explicitly assert the constraints: claimant cannot access ledger; must stay in character; responses should be concise.
- Add test assertions to validate that developer changes do not accidentally include ledger details in the messages sent to the AI.

## Testing Strategy

- Unit tests for ledger generator (deterministic properties like length, schema, hash stability for same seed/session), and verify `verifyTransaction` still works against the generated ledger.
- Integration tests for session lifecycle and API behaviors.
- E2E Playwright tests for mobile viewport simulating a regulator session and verifying decision outcomes and UI visibility.
