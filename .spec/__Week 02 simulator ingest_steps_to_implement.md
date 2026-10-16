# Implementation Steps: Week 2 — Simulator and Ingest Pipeline

This document outlines the step-by-step tasks required to implement the "Simulator and Ingest Pipeline" as defined in the `.spec/Week 02 simulator ingest.md` PRD.

## Phase 0: Prerequisites & Environment Setup

- [ ] **Workspace Verification**: Confirm `@sokil/contracts` is buildable and can be imported into `@sokil/backend` via workspace resolution (no `paths` entry in `tsconfig.json` required).
- [ ] **Type Checking**: Run `pnpm --filter @sokil/backend check-types` and ensure all errors are resolved.
- [ ] **Environment Variables**: Create `.env.example` containing all required keys: `PORT`, `WEB_ORIGIN`, `SIMULATOR_ENABLED`, `SIMULATOR_SEED`, `SIMULATOR_BATTERY_DRAIN_SECONDS`, and `INGEST_TOKEN` (placeholder).
- [ ] **Linting**: Ensure `pnpm lint` passes across the workspace.

## Phase 1: Math Core (Pure Functions)

*Focus: Developing the mathematical primitives required for navigation and deterministic randomness.*

- [ ] **Geographic Utilities**: Implement `src/domain/math/geo.ts`.
    - [ ] `offsetLatLon(lat0, lon0, eastM, northM)`: Spherical Earth model (radius 6,371,008.8 m).
    - [ ] `haversineM(a, b)`: Distance between two points.
    - [ ] Add `geo.spec.ts` for verification.
- [ ] **Pseudo-Random Number Generator**: Implement `src/domain/math/prng.ts`.
    - [ ] `mulberry32(seed)`: Returns a seeded generator.
    - [ ] `hashSeed(...parts: Array<number | string>)`: Returns a 32-bit seed.
    - [ ] Add `prng.spec.ts` for verification.

## Phase 2: Vehicle Model (The Deep Simulator Module)

*Focus: Creating a deterministic, pure-function-based vehicle movement model.*

- [ ] **Core Logic**: Implement `src/domain/simulator/vehicle-model.ts`.
    - [ ] Implement the `createVehicleModel(config)` factory.
    - [ ] Implement the circular movement math (heading/position based on `speedMps` and `radiusM`).
    - [ ] Implement the linear battery voltage drain.
    - [ ] Implement predictable noise injection using `prng`.
    - [ ] Ensure all samples are returned on the correct tick rates (10, 5, 2, 1 Hz).
- [ ] **Verification**: Implement `vehicle-model.spec.ts` covering:
    - [ ] Movement accuracy (radius check).
    - [ ] Battery depletion timing.
    - [ ] Seed determinism.

## Phase 3: Telemetry Core (State & Ingestion)

*Focus: Building the internal state management and the ingestion loop.*

- [ ] **Channel Catalog**: Implement `src/telemetry/channels.ts` containing `SIMULATOR_CHANNELS` and validation logic.
- [ ] **Session Management**: Implement `src/telemetry/session.service.ts`.
    - [ ] Lifecycle for a single active `Session`.
- [ ] **State Storage**: Implement `src/telemetry/latest-values.store.ts`.
    - [ ] `update(batch)`: logic for keeping/replacing the latest sample per channel.
    - [ ] `snapshot()`: returning current state.
- [ ] **Ingestion Engine**: Implement `src/telemetry/ingest.service.ts`.
    - [ ] `ingest(batch)`: updates the store and notifies via `batches$` (RxJS Subject).
- [ ] **Verification**: Implement all necessary `.spec.ts` files for these services.

## Phase 4: Simulator Integration

*Focus: Wiring the pure model into the running application.*

- [ ] **Simulator Source**: Implement `src/telemetry/sources/simulator.source.ts` (implements `TelemetrySource`).
    - [ ] Implement the 10Hz tick scheduling logic.
    - [ ] Integrate `SIMULATOR_ENABLED` environment flag and lifecycle hooks.
- [ ] **Verification**: Ensure the simulator starts/stops cleanly without leaving open handles (timer cleanup).

## Phase 5: Ingest Boundary (HTTP)

*Focus: Implementing the validated, authenticated entry point for external data.*

- [ ] **DTOs**: Define `TelemetryBatchSchema` and the corresponding Zod DTO in `src/telemetry/dto/`.
- [ ] **Security**: Implement `src/telemetry/ingest-token.guard.ts` using constant-time comparison.
- [ ] **Controller**: Implement `src/telemetry/ingest.controller.ts` with `POST /ingest/batch`.
    - [ ] Include semantic validation (session match, channel existence, value type matching).
- [ ] **Verification**: Implement e2e tests for the HTTP endpoint covering all requirement codes (202, 400, 401, 404, 422, 503).

## Phase 6: Telemetry Gateway (WebSocket)

*Focus: Real-time data distribution to connected clients.*

- [ ] **Gateway**: Implement `src/telemetry/gateway/telemetry.gateway.ts` (Socket.IO).
    - [ ] On connection: emit `session` and `snapshot`.
    - [ ] On batch: `volatile` emit to the active session room.
- [ ] **Verification**: Implement e2e tests for the WebSocket connection, event order, and room membership.

## Phase 7: Deployment & Final Verification

- [ ] **Observability Script**: Finalize `apps/backend/scripts/ws-listen.ts` for local monitoring.
- [ ] **Containerization**:
    - [ ] Update `Dockerfile` (multi-stage build: contracts -> backend).
    - [ ] Update `docker-compose.yml` with port mappings and environment variables.
- [ ] **Final Demonstration**: Run the stack via `docker compose` and verify via `ws-listen.ts` that telemetry matches the expected physics and battery drain.
