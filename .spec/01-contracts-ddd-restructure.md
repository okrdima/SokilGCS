# 01‑Contracts DDD Restructure

## Overview

We’re restructuring the `@sokil/contracts` package to adopt a clean Domain‑Driven Design (DDD) + Feature‑First (FSD) approach.  The goal is to provide a **stable, well‑typed public API** for the Ground Control Station (GCS) while keeping internal implementation details hidden.  The new structure follows these principles:

- **Domain‑level barrels** (one `index.ts` per domain) expose only the public types and DTOs.  
- **DTOs** are grouped by CRUD operations (e.g., `create‑drone.dto.ts`, `update‑drone.dto.ts`).  
- **Types** live in a dedicated `types/` folder per domain.  
- **Shared primitives** are in `shared/types/`.  
- **Root barrel** (`packages/contracts/src/index.ts`) re‑exports the domain barrels that form the public API.  
- **Naming** follows PascalCase for classes and kebab‑case for files (`CreateDroneDTO` → `create-drone.dto.ts`).

### Domain Folders

| Domain | Description | Key DTOs | Key Types | Barrel |
|--------|-------------|----------|-----------|--------|
| `shared` | Primitives & units (vectors, geo‑points, angles) | – | `Vector3D.type.ts`, `GeoPoint.type.ts`, `UnitUtils.type.ts` | `shared/index.ts` |
| `drone` | Vehicle state & command domain | `create-drone.dto.ts`, `update-drone.dto.ts`, `delete-drone.dto.ts` | `DroneState.type.ts`, `Command.type.ts` | `drone/index.ts` |
| `telemetry` | High‑frequency telemetry frames | `telemetry-frame.dto.ts` | `TelemetryFrame.type.ts` | `telemetry/index.ts` |
| `mission` | Waypoints & flight plans | `waypoint.dto.ts`, `mission-plan.dto.ts` | – | `mission/index.ts` |
| `map` | GIS & map sources | `tile-source.dto.ts`, `geo-overlay.dto.ts` | – | `map/index.ts` |
| `events` | System events & health | `flight-event.dto.ts`, `system-status.dto.ts` | – | `events/index.ts` |

### Root Barrel (`packages/contracts/src/index.ts`)

```ts
export * from './shared';
export * from './drone';
export * from './telemetry';
export * from './mission';
export * from './map';
export * from './events';
```

### Export Policy

- Only domain barrels (`drone`, `telemetry`, …) are exported by the root index.  
- DTOs and types are re‑exported by the domain barrel (`drone/index.ts`), keeping the public surface explicit.  
- Internal helpers stay unexported within their domain folders.

### Test Placement

- Unit tests live alongside their source file unless the file has more than two tests, in which case tests move to a `__tests__/` sub‑folder.  
- Integration and E2E tests reside in a top‑level `test/` or `e2e/` folder.

### Naming Convention

- **Class / type names**: PascalCase (`CreateDroneDTO`).  
- **File names**: kebab‑case (`create-drone.dto.ts`).  
- **Index files**: `index.ts` in each folder, re‑exporting public API.

## Implementation Decisions

- Adopted **hybrid DTO grouping** inspired by NestJS conventions.  
- Implemented **one‑file‑per‑type** inside `types/` sub‑folders, plus a global `shared/types/` for primitives.  
- Chose **domain‑level barrels** to keep the public API explicit and prevent accidental leaks.  
- Root barrel re‑exports only the domain barrels that form the public contract surface.  
- Naming follows PascalCase for classes and kebab‑case for files.

## Testing Decisions

- Tests focus on **external behavior**: verifying that DTOs validate data correctly and that type definitions align with expected shapes.  
- Unit tests for each DTO and type reside in the same folder.  
- Integration tests (e.g., mapping telemetry to UI components) will use the domain barrels to import DTOs and types.  
- Existing test patterns in the repository (e.g., Jest + ts-jest) will be reused.

## Out of Scope

- Implementation of the actual business logic for drones, telemetry, or missions—this spec covers only the contract layer.  
- Migration of existing code that consumes the old contract structure.  
- Deployment or CI/CD changes; those will be handled separately.

## Further Notes

- When adding new domain modules (e.g., `alerts`, `logging`), follow the same folder & barrel pattern.  
- Keep the public API stable: any change that alters exported shapes must be versioned and communicated via changelog.

## Folder Structure (textual representation)

```
packages/contracts/src/
├─ shared/
│   ├─ types/
│   │   ├─ Vector3D.type.ts
│   │   ├─ GeoPoint.type.ts
│   │   ├─ UnitUtils.type.ts
│   │   └─ index.ts
│   ├─ dto/
│   │   └─ index.ts
│   └─ index.ts
├─ drone/
│   ├─ types/
│   │   ├─ DroneState.type.ts
│   │   ├─ Command.type.ts
│   │   └─ index.ts
│   ├─ dto/
│   │   ├─ create-drone.dto.ts
│   │   ├─ update-drone.dto.ts
│   │   ├─ delete-drone.dto.ts
│   │   └─ index.ts
│   └─ index.ts
├─ telemetry/
│   ├─ types/
│   │   ├─ TelemetryFrame.type.ts
│   │   └─ index.ts
│   ├─ dto/
│   │   ├─ telemetry-frame.dto.ts
│   │   └─ index.ts
│   └─ index.ts
├─ mission/
│   ├─ types/
│   │   └─ index.ts
│   ├─ dto/
│   │   ├─ waypoint.dto.ts
│   │   ├─ mission-plan.dto.ts
│   │   └─ index.ts
│   └─ index.ts
├─ map/
│   ├─ types/
│   │   └─ index.ts
│   ├─ dto/
│   │   ├─ tile-source.dto.ts
│   │   ├─ geo-overlay.dto.ts
│   │   └─ index.ts
│   └─ index.ts
└─ events/
    ├─ types/
    │   └─ index.ts
    ├─ dto/
    │   ├─ flight-event.dto.ts
    │   ├─ system-status.dto.ts
    │   └─ index.ts
    └─ index.ts
```
