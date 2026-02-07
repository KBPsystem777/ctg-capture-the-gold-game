# Project Context

## Purpose ✅

Capture The Gold (CTG) is an interactive regulatory simulation that demonstrates how a distributed ledger acts as the single source of truth for high‑value transactions. CTG is a lightweight, explainable demo that helps regulators and stakeholders understand why persuasive narratives, documentation, or AI should never override ledger consensus.

**Core goals:**

- Teach ledger immutability and verification as the canonical truth
- Show AI's role as a persuasive assistant (not an authority)
- Provide a quick, demo-friendly experience for non‑technical audiences

---

## Tech Stack 🔧

- **Framework:** Next.js (App Router)
- **Language:** TypeScript (strict typing encouraged)
- **UI:** React + Tailwind CSS + ShadCN primitives
- **State:** React local state; use Zustand only when cross-component persistent global state is needed
- **AI:** `ai` SDK / OpenAI / Azure OpenAI (server-side usage only)
- **Hashing / crypto:** Node's `crypto` for SHA‑256 ledger hash
- **Package manager:** pnpm (recommended) or npm
- **Hosting:** Vercel (recommended for easy Next.js deployment)

---

## Project Conventions ✅

These conventions ensure consistency, testability, and maintainability.

### Code Style & Formatting

- Use **TypeScript** with strict checks and no implicit `any`.
- **Prettier + ESLint** for formatting and linting; run `pnpm lint` and `pnpm format` (add `format` script if not present).
- Use named and descriptive identifiers; avoid single-letter names except for indexes.
- Keep functions small and pure where possible.

### Component Patterns

- Create **hoisted arrow** components (exported hoisted arrow functions):
  - Example: `export const MyComponent = () => { return <div /> }`
- Fully type props with an explicit `type Props = {}` and provide default values where appropriate.
- Prefer composition and small, reusable primitives in `components/ui` and `components/*`.
- Document components with short **JSDoc** comments.

### Performance

- Minimize re-renders (memoize derived data, pass stable callbacks via `useCallback`).
- Lazy‑load non-critical UI (dynamic imports for heavy modules).

### Documentation

- Keep implementation notes in `openspec/` for design rationale and change proposals.
- Add short usage examples in JSDoc for complex functions and components.

---

## Architecture Patterns 🏗️

- **App Router** for pages and layouts. Keep page logic minimal; business logic belongs in `lib/`.
- **API Routes** (server-only actions):
  - `POST /api/chat` — Claimant AI interaction
  - `GET /api/ledger` — Read-only ledger snapshot (or import `lib/ledger.ts` directly in server code)
  - `POST /api/decision` — Record regulator decision (opt-in analytics)
- **Ledger** is an immutable JSON-like snapshot in `lib/ledger.ts` and must be read-only at runtime.
- **AI agents** are stateless HTTP clients invoked from server routes; the AI **must not** be given ledger state.
- Keep sensitive usage (API keys) server-side only (env vars). Do not commit secrets.

---

## Testing Strategy 🧪

- **Unit tests:** Jest + React Testing Library (component + hook tests). Aim for **90%+ coverage** for core logic and verification functions.
- **Integration/E2E (optional):** Playwright for user flows and decision verification on demo-critical flows.
- **Mock external services:** For AI calls, mock responses (and validate that only the server calls the AI provider). For ledger checks, import `lib/ledger.ts` functions and assert behavior.
- **Required tests:**
  - Ledger verification logic (`getLedger`, `getLedgerHash`, `verifyTransaction`)
  - Chat API behavior and system prompt enforcement (validate that the claimant prompt does not include ledger truth)
  - Decision flow (Release vs Reject paths) and UI state
  - Component rendering and accessibility checks
- **CI:** Fail builds on test failures and coverage below target (e.g., via GitHub Actions).

---

## Git Workflow & PR Rules 🌲

- Branch naming: `feature/<short-desc>`, `fix/<short-desc>`, `chore/<desc>`
- Use **Conventional Commits** for clear changelogs (e.g., `feat: add ledger verification`)
- Require PR reviews, passing CI (lint → build → tests), and changelog or PR description before merging
- Small, focused PRs preferred. Add test coverage for all new features.

---

## Domain Context (CTG-specific) 🔍

- Roles:
  - **Regulator:** Player inspecting claims and ledger snapshot; makes final decision
  - **Claimant (AI):** Persuasive agent that cannot access the ledger and must stay in-character
  - **Ledger:** Immutable source of truth — canonical for deciding payments
- Claim structure (examples in `lib/ledger.ts`): `id`, `gold_weight_kg`, `date`, `location`, `status`, `seller`, `buyer`
- Rules:
  - If a claim matches a ledger transaction → the regulator should release payment
  - If no matching transaction exists → the regulator should reject
  - The UI must display the ledger hash prominently to emphasize immutability

---

## Important Constraints & Security ⚠️

- **Ledger immutability:** Ledger is static (module-level constant or JSON); do NOT allow runtime mutation.
- **AI constraints:** The claimant system prompt (constructed in `app/api/chat/route.ts`) explicitly forbids referencing ledger truth.
- **Secret handling:** API keys and session secrets must be in environment variables (e.g., `OPENAI_API_KEY` server-side). Never commit keys.
- **Compliance:** Treat demo data as examples; avoid using real private or sensitive financial data in demos.

---

## External Dependencies & Integrations 🔗

- AI provider (OpenAI / Azure OpenAI) — server-only
- Hosting: Vercel recommended for Next.js
- Optional analytics (segment, Sentry) — configure via env vars and limit PII collection

---

## Developer Setup & Common Commands ⚙️

- Install: `pnpm install` (or `npm install`)
- Dev server: `pnpm dev` → opens http://localhost:3000
- Lint: `pnpm lint`
- Build: `pnpm build`
- (Add) Test: `pnpm test` (Jest + coverage — add scripts & config)

> Tip: Add `test`, `test:coverage`, `format`, and `lint:fix` scripts to `package.json` if missing.

---

## Where to look (key files) 📁

- `lib/ledger.ts` — immutable ledger and verification helpers
- `app/api/chat/route.ts` — claimant system prompt and chat API
- `app/api/decision/route.ts` — decision recording (analytics optional)
- `components/*` — UI panels (`chat-panel.tsx`, `ledger-panel.tsx`, `claim-panel.tsx`, `decision-panel.tsx`)
- `openspec/AGENTS.md` — procedure for proposals and design notes

---

## PR Checklist ✅

- [ ] Code compiles and types pass
- [ ] Linting and formatting applied
- [ ] Tests added and passing (coverage >= target)
- [ ] No secrets committed
- [ ] Documentation updated if behavior or contract changed

---

## Future Considerations / Extensions 🚀

- Replace static ledger with **Corda** replay for production realism (not necessary for demos)
- Add multi-claim rounds, regulator scoring, or consensus simulations
- Add optional E2E tests that verify the full regulator flow with a mocked AI backend

---

**Summary:** CTG is a focused demo with clear boundaries: AI persuades, documents support arguments, but the immutable ledger decides. Keep the codebase small, testable, and explainable to maximize demo impact.

---

©AuroSoft — Demo & Educational Use
