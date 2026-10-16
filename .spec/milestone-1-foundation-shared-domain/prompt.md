# Milestone 1: Foundation & Shared Domain

## Goal
Establish a testing framework within the `@sokil/contracts` package and validate the core shared domain (mathematical primitives and telemetry envelopes).

## Scope

### In-Scope
- **Test Runner Setup**: Install and configure Vitest for the `@sokil/contracts` package.
- **Shared Domain Testing**:
    - Create tests for core mathematical primitives (e.g., `Vector3D`).
    - Create tests for telemetry/alarm/command schemas.
    - For each schema, include:
        - **Positive tests**: Valid inputs that should pass.
        - **Negative tests**: Invalid/malformed inputs that should fail.

### Out-of-Scope
- Drone domain validation (Types, DTOs, and Entities).

## Instructions

1.  **Initialize Vitest**:
    - Install `vitest` as a dev dependency in `packages/contracts`.
    - Configure `vitest` (e.g., `vitest.config.ts`) to work with the project's TypeScript setup.
    - Add a `test` script to `packages/contracts/package.json`.

2.  **Implement Test Suite**:
    - Create a `tests/` directory (or similar) within `packages/contracts`.
    - Implement tests for:
        - **Shared Primitives**: Ensure math/vector types are correctly enforced.
        - **Telemetry/Alarm/Command**: Ensure the core domain schemas are robust.

3.  **Verification**:
    - Run the tests using `pnpm --filter @sokil/contracts test` (or the configured script).
    - Ensure all tests pass.

## Done When
- `vitest` is configured and runnable via `pnpm`.
- Tests for shared domain primitives and core schemas pass (both valid and invalid cases).
