# SokilGCS (Mission Control) 🛸

**SokilGCS** is a high-performance, modular UAV Ground Control Station (GCS) built for real-time telemetry tracking, high-frequency flight data analysis, mission planning, and multi-layer spatial data visualization.

Engineered with Domain-Driven Design (DDD) principles inside a high-throughput `pnpm` monorepo, SokilGCS bridges low-latency UAV communications with modern web visualization tools.

---

## 🌟 Key Features

- **⚡ Real-Time Telemetry & Timeline Control:** High-frequency ingestion and playback of flight telemetry metrics (attitude, position, radio RSSI, battery stats) at 60 FPS without UI jank.
- **🗺️ GIS & Geospatial Layering:** Multi-source map visualization supporting standard TMS/WMS layers, NASA GIBS, NOAA, and spatial overlays (flight paths, geofences, and no-fly zones).
- **🎯 Mission Planning & Flight Commands:** Complete flight lifecycle management, including waypoint sequencing, payload commands (Takeoff, Land, RTL), and parameter sync.
- **📦 Strictly Typed DDD Contracts:** Single source of truth for interfaces and DTOs across frontend and backend services via `@sokil/contracts`.
- **🛠️ Spec-Driven Architecture:** Codebase governed by explicit specification documents (`.spec/`) to guarantee performance bounds, strict typing, and clean domain boundaries.

---

## 🏗️ Architecture & Tech Stack

SokilGCS is structured as a Turborepo-managed `pnpm` workspace to ensure fast build times and strict boundary enforcement between services.

### Core Stack
- **Monorepo Manager:** [Turborepo](https://turbo.build/) + `pnpm` workspaces
- **Frontend:** [Next.js](https://nextjs.org/) / React (App Router, Tailwind CSS, Leaflet/Mapbox)
- **Backend:** [NestJS](https://nestjs.com/) (WebSocket Gateway, MAVLink/Telemetry processing pipeline)
- **Shared Contracts:** TypeScript (`@sokil/contracts`)

### Domain Boundaries (`packages/contracts`)
The core domain model is separated into 6 explicit sub-domains:
1. `shared/` — Primitive spatial vectors (`Vector3D`, `GeoPoint`), Euler angles, and unit utilities.
2. `drone/` — Vehicle connection state, heartbeats, flight modes, and execution commands.
3. `telemetry/` — High-frequency streaming frames, time-series data structures, and log playback indices.
4. `mission/` — Flight plans, waypoints, geofences, and rally point structures.
5. `map/` — Tile layer configurations, spatial overlays, and GIS metadata.
6. `events/` — Critical system alerts, warnings (`FAILSAFE_RTL`, `LOW_BATTERY`), and hardware status logs.

---

## 📁 Repository Structure

```text
.
├── .opencode/           # Agent orchestration configs & spec checkers
├── .spec/               # Technical specifications & ACs
├── apps/
│   ├── gcs-frontend/             # Next.js Ground Control Station dashboard
│   └── backend/             # NestJS telemetry & mission control gateway
└── packages/
    ├── contracts/       # @sokil/contracts (DDD domain DTOs, types, barrels)
    ├── tsconfig/        # Shared TypeScript configurations
    └── eslint-config/   # Shared linting rules
```

## 🚀 Getting Started

### Prerequisites
- **Node.js:** `>=18.0.0`
- **Package Manager:** `pnpm` (`>=8.0.0`)

### Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/okrdima/SokilGCS.git](https://github.com/okrdima/SokilGCS.git)
   && cd SokilGCS
   ```

2. **Install dependencies:**
   ```bash
   pnpm install
   ```

3. **Build shared contracts:**
   ```bash
   pnpm --filter @sokil/contracts build
   ```

4. **Start the development servers:**
   ```bash
   pnpm dev
   ```

---

## 🛠️ Development & Quality Assurance

SokilGCS uses strict type-checking and automated specification auditing to prevent regressions in high-frequency data pathways.

- **Check Types:**
  ```bash
  pnpm check-types
  ```

- **Lint Codebase:**
  ```bash
  pnpm lint
  ```

- **Build All Packages:**
  ```bash
  pnpm build
  ```
