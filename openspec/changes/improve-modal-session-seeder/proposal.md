# Proposal: Improve Modal Responsiveness, Session Initialization, and Ledger Seeder

Change-id: improve-modal-session-seeder

## Why

The current game experience has several technical and UI/UX friction points:

1. The `DecisionModal` is not fully responsive, causing layout issues on smaller screens and overflowing on desktop when content is long.
2. Duplicate `/api/session` calls waste server resources and can cause race conditions during initialization.
3. The "Ledger" side of the decision feedback is often empty, failing to explain the discrepancy when no match is found.
4. The ledger seeder creates transactions in non-PH locations (Singapore, Hong Kong, Dubai), which breaks the "BSP only buys locally from Minahang Bayan" regulatory context.

## What Changes

- **Responsive Decision Modal**: Refactor `DecisionModal` with `max-h-[90vh]`, internal scrolling, and a mobile-first stacked layout that transitions to a side-by-side grid on desktop.
- **Single Session Initialization**: Implement an initialization guard in `GameContainer` to ensure `/api/session` is called exactly once per session.
- **Enhanced Comparison UI**: Update `DecisionModal` to display "Closest Matches" from the ledger if an exact match is missing, highlighting specifically where the differences are.
- **PH-Only Ledger Locations**: Update the `LOCATIONS` data in `lib/session-ledger.ts` to only include approved Minahang Bayan sites in the Philippines.

## Impact

- **Affected specs**: `decision-feedback`, `session-management`, `ledger-seeder`
- **Affected code**: `components/decision-modal.tsx`, `components/game-container.tsx`, `lib/session-ledger.ts`.
