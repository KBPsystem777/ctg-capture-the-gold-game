# Tasks — make-mobile-first-app

1. Design & Theme
   - [x] Add Tailwind theme tokens (primary: `#005D9F`, background: light white) and utility classes.
   - [x] Audit `components/*` and list mobile-specific layout work (headers, footers, chat panel, ledger panel).
   - Validation: `tailwind` builds and color variables produce expected CSS.

2. Mobile-first UI Implementation
   - [x] Update `layout.tsx` and global styles for mobile-first defaults (larger touch targets, accessible font sizes).
   - [x] Implement responsive variants for `chat-panel`, `ledger-panel`, `claim-panel`, `decision-panel`.
   - [x] Ensure ledger hash and critical controls are visible in compact mobile view.
   - Validation: Visual snapshot tests at mobile and tablet viewports.

3. Ledger Session Generator
   - [x] Add server-side ledger generation module that creates a randomized set of transactions per session.
   - [x] Compute and store ledger hash (SHA‑256) at generation time.
   - [x] Expose `GET /api/ledger?session=<id>` to fetch the immutable snapshot for that session.
   - Validation: Unit tests for generation, uniqueness, immutability per session, and hash integrity.

4. Session Management
   - [x] Implement lightweight session mechanism (signed cookie or ephemeral session id) to tie UI to a generated ledger snapshot.
   - [x] Ensure sessions expire and do not retain PII.
   - Validation: Integration tests cover session lifecycle (create, use, expire).

5. AI Chat Enhancements & Security
   - [x] Update `app/api/chat/route.ts` to accept per-session claim data and enforce system prompt from server configuration.
   - [x] Add server-side validation to ensure claimant cannot see ledger contents.
   - [x] Document how to set `OPENAI_API_KEY` and `CLAIMANT_SYSTEM_PROMPT` in env.
   - Validation: Tests asserting chat route never passes ledger state to AI and enforces prompt constraints.

6. Tests & CI
   - [x] Add Jest + RTL tests for UI components and lib functions (`lib/ledger.ts` replacement or augmentation).
   - [ ] Add Playwright E2E tests for mobile viewport covering a user approving and rejecting claims. (optional follow-up)
   - [x] Add GitHub Actions workflow to run lint, tests, and coverage checks.
   - Validation: CI passes and enforces coverage threshold.

7. Documentation
   - [x] Update `openspec/project.md` (completed) and add a short `openspec/changes/...` design note referencing the mobile-first changes.
   - Validation: PR includes updated docs and matches acceptance criteria.

Notes:

- Keep changes minimal and scoped to the items above. If additional features are requested (multi-claim rounds, scoring), open a follow-up change.
