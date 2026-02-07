## ADDED Requirements

### Requirement: Responsive Verdict Modal

The `DecisionModal` MUST be usable across all screen sizes without content being clipped or buttons being obscured.

#### Scenario: Mobile viewport

- **WHEN** viewed on a small screen (width < 768px)
- **THEN** the Claim and Ledger sections SHALL stack vertically.
- **AND** the component SHALL support vertical scrolling if content exceeds height.

### Requirement: Cross-Reference Evidence

The `DecisionModal` SHALL show proximal evidence from the ledger when an exact match is missing to explain the "Rejection" verdict.

#### Scenario: Partial match display

- **WHEN** evaluated result is "Incorrect" and no direct ledger entry exists
- **THEN** the modal SHALL display the closest ledger entries providing cues to the discrepancy.
