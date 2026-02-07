# Capture The Gold (C2G) - Regulatory Simulation

An interactive regulatory simulation game demonstrating DLT (Distributed Ledger Technology) as the source of truth in high-value transactions.

## 🔗 The Core Concept: Trust Hierarchy

In this simulation, players act as regulators who must decide whether to "Release" or "Reject" gold sale claims. The game illustrates a fundamental principle of DLT-based systems:

1.  **AI talks** (Persuasion layer - the claimant AI will try to convince you).
2.  **Documents persuade** (Paper layer - documents are supporting evidence but can be faked or inaccurate).
3.  **The Ledger decides** (Authority layer - the immutable record of truth).

## 🚀 Features

- **AI-Generated Session Ledgers**: Every play-through starts with a unique, cryptographically hashed ledger generated either by OpenAI (if configured) or a robust local random generator. No static snapshots are used.
- **Interactive Claimant AI**: Chat with a sophisticated AI agent that represents the claimant's interests.
- **Immutable Proof**: Every session comes with a SHA-256 session hash that locks the ledger state for that session, ensuring auditability.
- **Mobile-Responsive UI**: Optimized for mobile and desktop, including quick-action bars for rapid regulatory decisions.
- **Decision Feedback Modal**: Detailed side-by-side analysis after every decision, explaining the "Trust Hierarchy" and how your decision compared to the ledger truth.

## 🛠 Tech Stack

- **Framework**: Next.js 15+ (App Router)
- **AI**: OpenAI SDK (GPT-4o / GPT-4 Turbo)
- **UI**: Tailwind CSS, Shadcn UI, Radix UI
- **State**: React Hooks (Native)
- **Verification**: SHA-256 Cryptographic Hashing

## 🏁 Getting Started

1.  Clone the repository.
2.  Install dependencies: `pnpm install`.
3.  Set up environment: `cp .env.example .env` and add your `OPENAI_API_KEY`.
4.  Run development server: `pnpm dev`.

## 🛡 Verification

At any time during a session, you can see the **Session Audit Hash** in the header. This hash is a unique fingerprint of the current session's transactions. If even one digit of a transaction were changed, the hash would change completely—illustrating the immutability of the ledger.
