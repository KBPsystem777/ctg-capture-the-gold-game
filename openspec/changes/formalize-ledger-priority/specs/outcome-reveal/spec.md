# Spec: Enhanced Outcome Reveal

## ADDED Requirements

### Requirement: Trust Hierarchy visualization

MUST: The outcome reveal UI MUST explicitly present the Trust Hierarchy (Human/AI, Documents, Ledger).

#### Scenario: Visualizing the lesson

- Given a regulator makes a decision
- When the outcome is revealed
- Then the UI MUST show a comparison of the three trust layers (AI/Docs/Ledger)
- And the UI MUST highlight that only the Ledger has the authority to decide

### Requirement: Educational message clarity

MUST: The system MUST provide an educational message that explains _why_ the ledger overrides persuasion.

#### Scenario: Correct decision message

- Given the regulator was correct
- When the result displays
- Then the message MUST reinforce that they correctly prioritized the ledger over narratives

#### Scenario: Incorrect decision message

- Given the regulator was incorrect (fooled by AI/Docs)
- When the result displays
- Then the message MUST clearly state that they relied on fallible layers instead of the ledger truth

## Validation

- Review `DecisionPanel` rendering in mobile and desktop viewports after decision
- Assert all trust hierarchy elements are present and legible
