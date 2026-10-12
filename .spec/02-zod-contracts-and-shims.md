# 02‑Zod Contracts & Shims

## Context & Objectives
The `@sokil/contracts` package currently contains a mix of hand‑crafted TypeScript interfaces and ad‑hoc runtime validation logic.  
This specification defines a **single source of truth**: every domain entity will be represented by a Zod schema, and the corresponding static TypeScript type will be inferred via `z.infer`.  
The goal is to improve **type safety**, reduce duplication, and enable **zero‑regression** while preserving backward compatibility for existing consumers.

## 1. Versioned Payload Envelope & Shim Architecture
| Element | Purpose | Implementation |
|---------|---------|----------------|
| `Envelope<T>` | Wraps every payload with metadata for versioning and timestamping. | `z.object({ version: z.number().int().min(1), timestamp: z.number().int().positive(), payload: z.any() })` |
| `transformV1toV2` | A runtime transformer that converts V1 payloads into the current V2 schema. | Accepts `unknown`, parses via V1 schema, maps fields to V2, returns a V2 value. |
| `parsePayload<T>` | Public helper that detects the envelope version and dispatches to the appropriate schema or shim. | Returns `z.infer<typeof T>` or throws a validation error. |

**Versioning strategy**  
* All new payloads are emitted with `version: 2`.  
* V1 payloads are still accepted for a 90‑day deprecation window, after which the shim will be removed.  
* Consumers must use `parsePayload` to avoid manual schema selection.

## 2. Domain Schema Specifications
### 2.1 Shared Domain (`shared/`)
| Entity | Schema | Boundaries |
|--------|--------|------------|
| `Vector3D` | `z.object({ x: z.number(), y: z.number(), z: z.number() })` | No external bounds (used for velocity). |
| `GeoPoint` | `z.object({ lat: z.number().min(-90).max(90), lon: z.number().min(-180).max(180), alt: z.number() })` | Altitude can be negative (below sea level). |
| `Battery` | `z.object({ percentage: z.number().min(0).max(100), voltage: z.number().min(0) })` | |
| `SignalStrength` | `z.number().min(-120).max(0)` | |

### 2.2 Drone Domain (`drone/`)
| Entity | Schema | Notes |
|--------|--------|-------|
| `FlightMode` | `z.enum(['PARKED', 'TAKEOFF', 'LOITER', 'LANDING', 'MANUAL', 'AUTO'])` | |
| `DroneState` | `z.object({ droneId: z.string(), mode: FlightMode, heartbeat: z.number().int().positive() })` | |

### 2.3 Telemetry Domain (`telemetry/`)
| Entity | Schema | Notes |
|--------|--------|-------|
| `TelemetryFrame` | `z.object({ timestamp: z.union([z.number().int().positive(), z.string().refine((s) => !isNaN(Date.parse(s))]), droneId: z.string(), position: GeoPoint, velocity: Vector3D, rssi: SignalStrength, battery: Battery, missionId: z.string().optional(), raw: z.unknown().optional() })` | |
| `TelemetrySummary` | Aggregated stats (e.g., mean, max) | Optional; defined if needed. |

### 2.4 Mission, Map, Events Domains
* Similar pattern: define a Zod schema for each DTO, infer the type, export both under the same name.  
* Enforce numeric ranges where domain dictates (e.g., map zoom level 0–20).

## 3. Dependency Graph & Barrel Export Rules
* **Unidirectional tree**:  
  * `shared` → `drone` → `telemetry` → `events`.  
  * No reverse imports.  
* **Flat barrel** (`packages/contracts/src/index.ts`):  
  ```ts
  export * from './shared/vector';
  export * from './shared/others';
  export * from './drone/dto/drone-state.dto';
  export * from './telemetry/dto/telemetry-frame.dto';
  export * from './events/telemetry-event.dto';
  ```
* **No circular refs**: each module only imports schemas from its parents, never from siblings or children.  
* **Single source of truth**: every exported type is `z.infer<typeof XSchema>`. No duplicate `type` declarations.

## 4. Performance Guidelines for 60 Hz Telemetry Ingestion
1. **Lazy validation** –  
   * In the hot path (WebSocket receiver), perform a *shallow* POJO check (e.g., `typeof obj === 'object' && obj !== null`).  
   * Queue the frame for *background* validation using `parsePayload`.  
2. **Schema reuse** – keep a single instance of each schema; Zod instances are stateless and cheap to reuse.  
3. **Batching** – if the server receives bursts, batch up to 100 frames before a single validation pass.  
4. **Typed array fallback** – for telemetry streams, consider a binary format (e.g., MessagePack) and a minimal decoder that produces the POJO before schema validation.  
5. **Back‑pressure** – implement a bounded ring buffer; drop the oldest frames when the consumer lags.  
6. **Metrics** – expose validation latency and drop rate as Prometheus metrics.

## 5. Acceptance Criteria Checklist
- **[ ]** Every domain DTO has a Zod schema and an inferred type exported under the same name.  
- **[ ]** `Envelope<T>` and `parsePayload<T>` functions exist and correctly dispatch based on `version`.  
- **[ ]** `transformV1toV2` is unit‑tested against representative V1 payloads.  
- **[ ]** All numeric fields respect the specified bounds (e.g., `lat ∈ [-90,90]`).  
- **[ ]** The dependency graph is acyclic; a topological sort of imports succeeds.  
- **[ ]** The barrel export (`packages/contracts/src/index.ts`) re‑exports every schema and type without duplication.  
- **[ ]** High‑frequency telemetry ingestion passes a benchmark: < 5 ms per frame on a 2 GHz MacBook, 60 Hz throughput sustained for 10 min without GC pauses.  
- **[ ]** The build (`pnpm build`) produces no type errors or lint warnings in the contracts package.  
- **[ ]** Existing consumers compile against the new contracts without changes (compile‑time test).  
- **[ ]** A deprecation notice is added for V1 envelope in the README, with a 90‑day grace period.  

--- 
## Out of Scope
* Implementing the binary telemetry protocol (MessagePack, uPlot serialization).  
* Adding runtime schema validation to the frontend UI beyond what the contract layer provides.  
* Updating third‑party integrations that consume the old contract format.  

## Further Notes
* All change requests should reference ADR #42 (Schema‑Driven Contracts) and ADR #47 (Telemetry Ingestion Performance).  
* The shim implementation should be kept in a separate `src/shims/` directory to isolate version‑migration logic.  

--- 
*Prepared by the Lead Software Architect, SokilGCS – 2026‑10‑02*