# Tasks: Modal, Session, and Seeder

## 1. Session Management

- [ ] Add `useRef` initialization guard to `GameContainer`'s `useEffect` for session creation.
- [ ] Verify using browser console or network tab that `/api/session` is called exactly once.

## 2. Regulatory Seeder Update

- [ ] Update `LOCATIONS` array in `lib/session-ledger.ts` with Philippines Minahang Bayan locations.
- [ ] Remove Singapore and Hong Kong references.
- [ ] Update OpenAI prompt instructions in `generateSessionLedgerAI` to strictly enforce PH-only locations.

## 3. Responsive Decision Modal

- [ ] Refactor `DecisionModal.tsx` to use a responsive grid (`grid-cols-1 md:grid-cols-2`).
- [ ] Add `max-h-[85vh]` and `overflow-y-auto` to the content area.
- [ ] Ensure buttons are always visible or reachable at the bottom.

## 4. Ledger Comparison UX

- [ ] Update `DecisionModal` to handle cases where `ledgerTransaction` is null but `basis.closestMatches` contains data.
- [ ] Render a "Did you mean?" or "Nearby entries" section when a match is missed.
- [ ] Visually differentiate matched vs mismatched fields between the Claim and the Ledger.

## 5. Validation

- [ ] Validate implementation with `openspec validate`.
- [ ] Test on mobile viewport and desktop viewport.
