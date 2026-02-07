# Design: Modal, Session, and Seeder Improvements

This document details the architectural and UI/UX decisions for improving the game's core simulation loop.

## 1. Modal Responsiveness & Layout

- **The Problem**: Long narratives or multiple basis fields push the modal buttons off-screen.
- **The Solution**:
  - Wrap the middle content of the `DecisionModal` in a `ScrollArea` or use `overflow-y-auto` with a fixed `max-height`.
  - Use `grid-cols-1 md:grid-cols-2` for the Claim vs Ledger comparison blocks.
  - Standardize `sm:max-w-2xl` or `lg:max-w-4xl` to prevent desktop overflow.

## 2. Session Initialization Guard

- **The Problem**: React Strict Mode causes `useEffect` to fire twice, leading to two parallel session creations.
- **The Solution**: Use a `useRef` guard (e.g., `initialized = useRef(false)`) inside the `useEffect` in `GameContainer` to ensure the fetch only executes once.

## 3. Difference-Aware Result UI

- **The Problem**: When a claim is rejected, the "Ledger" side often just says "Null Record Found", which doesn't help the user learn.
- **The Solution**:
  - If `ledgerTransaction` is null, check `evaluation.basis.closestMatches`.
  - Render the nearest entries found in the ledger.
  - Explicitly mark fields that _differed_ (e.g., Weight: 100kg vs 105kg).

## 4. Regulatory Context (Filipino Minahang Bayan)

- **The Problem**: BSP (Bangko Sentral ng Pilipinas) regulatory desk only handles domestic gold purchases through approved channels.
- **The Solution**: Remove all non-PH locations. Replace with specific Minahang Bayan locations:
  - Camarines Norte (Jose Panganiban, Paracale)
  - Benguet (Itogon, Tuba)
  - Compostela Valley (Monkayo)
  - Masbate (Aroroy)
  - Agusan del Sur (Rosario, Bunawan)
  - Zamboanga del Norte (Siocon)
