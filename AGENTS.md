# SokilGCS — AI Agent Guidelines & Architecture

## 1. Monorepo Overview
- **Package Manager**: `pnpm` (Workspace mode).
- **Build System**: `turborepo`.
- **Primary Tech Stack**: TypeScript, NestJS (backend), Next.js App Router (frontend), Tailwind CSS, uPlot, Three.js/Cesium.

## 2. Directory Structure
- `apps/backend`: NestJS Server Application (`@sokil/backend`).
- `apps/gcs-frontend`: Next.js Ground Control Station Interface (`@sokil/gcs-frontend`).
- `packages/config`: Shared TSConfig, ESLint, and Prettier configurations (`@sokil/config`).
- `packages/contracts`: Shared Domain DTOs, Types, and API Interfaces (`@sokil/contracts`).
- `.spec/`: Feature specifications and acceptance criteria for Spec-Driven Development (SDD).

## 3. Domain-Driven Design (DDD) for Contracts
All domain entities must reside in `packages/contracts/src/`:
- `shared/`: Common mathematical & vector primitives (`vector.ts`, telemetry envelopes).
- `drone/`: Drone management (`dto/`, `types/`, `index.ts`).
- `telemetry/`: Time-series flight telemetry (`dto/`, `types/`, `index.ts`).
- `index.ts`: Barrel export for all domain sub-modules.

## 4. Execution & Code Rules for Agents
1. **Tool Usage**:
   - Always run commands via `pnpm` (NEVER use `npm` or `yarn`).
   - Run workspace-specific commands using `pnpm --filter <app-or-package-name> <command>`.
   - Before adding native C/C++ dependencies, verify `allowBuilds` in `pnpm-workspace.yaml`.
2. **Type Safety**:
   - Strict TypeScript mode is enforced. Do not use implicit `any`.
   - Prefer workspace imports (e.g., `import { Vector3D } from '@sokil/contracts'`).
3. **Spec-Driven Development Workflow**:
   - Always check `.spec/` for detailed feature requirements and acceptance criteria before implementing code.
   - Run type checks (`pnpm check-types` or `pnpm --filter @sokil/contracts build`) after modifying shared contracts.
