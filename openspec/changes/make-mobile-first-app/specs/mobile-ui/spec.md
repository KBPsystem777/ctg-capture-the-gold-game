# Spec: Mobile-first UI

## ADDED Requirements

### Requirement: Mobile-first layout and responsiveness

MUST: The UI MUST be mobile-first and usable on phones (375x812), tablets (768x1024), and desktop (1366x768). The primary target is mobile.

#### Scenario: Mobile stacked layout

- Given a regulator opens the app on a phone
- When the claim loads
- Then the UI shows: claim details, chat panel, and a collapsed ledger control
- And decision controls are prominent and usable by thumb

#### Scenario: Tablet two-column layout

- Given app on a tablet viewport
- When the claim loads
- Then chat and claim panels are displayed side-by-side and the ledger is accessible as a collapsible panel or bottom sheet

#### Scenario: Accessible colors and theming

- Given the primary color is `#005D9F` and background is light white
- When primary buttons are rendered
- Then color contrast must meet WCAG AA for text and UI elements

## Validation

- Visual snapshot tests for mobile and tablet viewports
- Accessibility checks for color contrast and touch target sizes
