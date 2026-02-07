# Spec: UI Optimization for Mobile

## MODIFIED Requirements

### Requirement: Tabbed Navigation on Mobile

The main game interface SHALL use a tabbed navigation system on mobile devices to switch between logical sections of the simulation.

#### Scenario: Switching contexts on Mobile

- Given a mobile device
- When the game container loads
- Then the user should see tabs for "Details", "Chat", and "Verify".
- And clicking "Verify" should show both the Ledger and the Decision panels.

### Requirement: Responsive Trust Hierarchy Table

The Trust Hierarchy table MUST be readable on screens as narrow as 320px.

#### Scenario: Narrow viewport result reveal

- Given a mobile screen
- When the outcome is revealed
- Then the Trust Hierarchy table should either scroll horizontally or adapt its layout to avoid clipping.
- And the text must remain at a legible size (minimum 12px).
