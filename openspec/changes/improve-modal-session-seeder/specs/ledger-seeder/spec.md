## MODIFIED Requirements

### Requirement: Geographic Purity

The ledger generation engine MUST only produce transactions within the Philippines.

#### Scenario: Domestic-only records

- **WHEN** transactions are seeded (either via local RNG or AI)
- **THEN** every `location` field MUST be a Philippine site.
- **AND** non-domestic locations (e.g. Singapore, Hong Kong) MUST be excluded.
