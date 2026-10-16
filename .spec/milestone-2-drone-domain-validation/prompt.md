# Milestone 2: Drone Domain Validation

## Goal
Complete the deep dive into the drone domain by validating its types, DTOs, and entities.

## Scope

### In-Scope
- **Drone Domain Testing**:
    - **Types/Schemas**: Test the core structural definitions.
    - **DTOs (Data Transfer Objects)**: Test validation for incoming/outgoing API data.
    - **Entities**: Test the core state and behavior of drone objects.
    - For each, include:
        - **Positive tests**: Valid inputs that should pass.
        - **Negative tests**: Invalid/malformed inputs that should fail.

### Out-of-Scope
- Shared domain testing (Primitives, Telemetry).

## Instructions

1.  **Implement Test Suite**:
    - Create/use the existing test infrastructure.
    - Implement tests for the Drone domain:
        - **Core Types**: Validate base drone definitions.
        - **DTOs**: Ensure API data structures are strictly validated.
        - **Entities**: Ensure entity state/behavior adheres to schemas.

2.  **Verification**:
    - Run the full test suite via the package manager.
    - Ensure all tests pass.

## Done When
- All drone-specific schema tests (Types, DTOs, Entities) pass, covering both valid and invalid scenarios.
