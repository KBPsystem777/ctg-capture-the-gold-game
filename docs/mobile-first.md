## Mobile-first & Session Ledger Notes

This document summarizes the mobile-first decisions and how session-scoped ledgers work.

## Mobile Viewport & Accessibility

- The viewport meta tag in `app/layout.tsx` is set to `width=device-width, initial-scale=1, maximum-scale=1`.
- **Reasoning**: This prevents the mobile browser from automatically zooming in when input fields receive focus, which often disrupts the UI and leaves the user in an awkward zoom state.
- **Accessibility Trade-off**: Disabling user-initiated zoom (`maximum-scale=1`) can be a barrier for users with visual impairments who rely on pinch-to-zoom. In a production environment, we would ideally avoid zoom by ensuring all inputs have a font size of at least 16px, or by providing an accessibility toggle to re-enable zoom. For this simulation, the fixed-scale UI was prioritized for the "kiosk" feel requested.

## Theme & UI

- Background: light white (#FBFCFD)
- Primary color: #005D9F
- Tailwind tokens are defined via CSS variables in `app/globals.css`
- UI defaults are mobile-first with stacked layouts on small screens and two-column on tablets

## Session Ledger

- A session is created via `POST /api/session`. The server sets an HttpOnly cookie `ctg_session`.
- The server generates an immutable ledger snapshot per session and computes a SHA-256 hash.
- `GET /api/ledger` returns the session ledger when session cookie is present; `GET /api/ledger?session=<id>` fetches by id.
- Sessions expire after 1 hour (configurable in `lib/session-ledger.ts`).

## AI & Security

- AI system prompt is configurable via `CLAIMANT_SYSTEM_PROMPT` (server-side env var).
- OpenAI API key should be set via `OPENAI_API_KEY` (server-side env var).
- The claimant agent must never receive ledger truth — server code sanitizes claim data before forming prompts.

## Test & CI

- Jest unit tests added under `__tests__` (run `pnpm test`)
- GitHub Actions workflow added at `.github/workflows/ci.yml`
