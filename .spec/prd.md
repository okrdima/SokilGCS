# PRD · Add Test Runner to Contracts

## What we're building

Establish a testing framework within the `@sokil/contracts` package to rigorously validate domain schemas. The goal is to ensure that all shared data contracts are correctly enforced through automated tests that cover both expected valid inputs and edge-case invalid examples.

**Tech Stack**

- [Vitest]
- [TypeScript]
- [Zod]

## What the app does

1. <i data-lucide="zap" class="w-3.5 h-3.5"></i> **Test Runner Configuration**: Setup of a fast, modern test runner (Vitest) specifically for the `@sokil/contracts` package.
2. <i data-lucide="zap" class="w-3.5 h-3.5"></i> **Positive Validation Tests**: Tests that verify correct data structures are accepted by the schemas (the "happy path").
3. <i data-lucide="zap" class="w-3.5 h-3.5"></i> **Negative Validation Tests**: Tests that verify invalid or malformed data are correctly rejected (edge cases and errors).
4. <i data-lucide="zap" class="w-3.5 h-3.5"></i> **Core Domain Coverage**: Dedicated test sets for the Telemetry, Alarm, and Command schemas to ensure complete coverage of the main domain.
5. <i data-lucide="zap" class="w-3.5 h-3.5"></i> **Workspace Integration**: Ensuring these tests run via the standard `pnpm test` command and integrate with the project's CI/CD pipeline.

## Out of scope (v1)

- <i data-lucide="minus-circle" class="w-3.5 h-3.5"></i> Cross-Package Integration Tests — Testing how the backend or frontend *use* the contracts.
- <i data-lucide="minus-circle" class="w-3.5 h-3.5"></i> Performance Benchmarking — Measuring the exact microsecond latency of schema validation.
- <i data-lucide="minus-circle" class="w-3.5 h-3.5"></i> Automated Schema Generation — Implementing tools to auto-generate these schemas from other formats.

## Data model

<div class="print-card rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5">
  <div class="flex items-center gap-2">
    <i data-lucide="box" class="w-4 h-4 text-zinc-500 dark:text-zinc-400"></i>
    <h3 class="font-semibold text-zinc-900 dark:text-zinc-100">Shared Domain</h3>
  </div>
  <p class="mt-3 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">Core mathematical primitives and telemetry envelopes.</p>
</div>

<div class="print-card rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5">
  <div class="flex items-center gap-2">
    <i data-lucide="box" class="w-4 h-4 text-zinc-500 dark:text-zinc-400"></i>
    <h3 class="font-semibold text-zinc-900 dark:text-zinc-100">Drone Domain</h3>
  </div>
  <p class="mt-3 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">Types, DTOs, and Entities for drone management.</p>
</div>

## Milestones

<article class="print-card rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden">
  <header class="flex items-center gap-3 p-5 border-b border-zinc-100 dark:border-zinc-800">
    <span class="shrink-0 w-8 h-8 rounded-full bg-zinc-900 dark:bg-zinc-100 text-zinc-50 dark:text-zinc-900 flex items-center justify-center text-sm font-semibold">1</span>
    <h3 class="font-semibold text-lg text-zinc-900 dark:text-zinc-100">Foundation & Shared Domain</h3>
  </header>
  <div class="p-5">
    <p class="text-zinc-600 dark:text-zinc-400 leading-relaxed">Set up the Vitest test runner and write tests for the core mathematical and telemetry primitives.</p>
    <div class="mt-5 grid grid-cols-1 md:grid-cols-2 gap-5">
      <div>
        <h4 class="text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
          <i data-lucide="check-circle-2" class="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400"></i>What gets built
        </h4>
        <ul class="mt-3 space-y-2 text-sm text-zinc-700 dark:text-zinc-300 list-none p-0">
          <li class="flex items-start gap-2"><i data-lucide="check" class="w-3.5 h-3.5 mt-0.5 shrink-0 text-emerald-600 dark:text-emerald-400"></i><span>Vitest configuration</span></li>
          <li class="flex items-start gap-2"><i data-lucide="check" class="w-3.5 h-3.5 mt-0.5 shrink-0 text-emerald-600 dark:text-emerald-400"></i><span>Shared domain schema tests (Primitives, Telemetry)</span></li>
        </ul>
      </div>
      <div>
        <h4 class="text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
          <i data-lucide="x-circle" class="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-500"></i>Not in this milestone
        </h4>
        <ul class="mt-3 space-y-2 text-sm text-zinc-500 dark:text-zinc-400 list-none p-0">
          <li class="flex items-start gap-2"><i data-lucide="minus" class="w-3.5 h-3.5 mt-0.5 shrink-0"></i><span>Drone domain (Types, DTOs, Entities)</span></li>
        </ul>
      </div>
    </div>
    <div class="mt-5 rounded-md border-l-4 border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30 p-4 text-sm text-emerald-900 dark:text-emerald-200">
      <p class="flex items-start gap-2"><i data-lucide="flag" class="w-4 h-4 mt-0.5 shrink-0"></i><span><span class="font-semibold">Done when:</span> Vitest is configured and shared domain tests pass.</span></p>
    </div>
  </div>
</article>

<article class="print-card rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden">
  <header class="flex items-center gap-3 p-5 border-b border-zinc-100 dark:border-zinc-800">
    <span class="shrink-0 w-8 h-8 rounded-full bg-zinc-900 dark:bg-zinc-100 text-zinc-50 dark:text-zinc-900 flex items-center justify-center text-sm font-semibold">2</span>
    <h3 class="font-semibold text-lg text-zinc-900 dark:text-zinc-100">Drone Domain Validation</h3>
  </header>
  <div class="p-5">
    <p class="text-zinc-600 dark:text-zinc-400 leading-relaxed">Complete the deep dive into Drone types, DTOs, and Entities.</p>
    <div class="mt-5 grid grid-cols-1 md:grid-cols-2 gap-5">
      <div>
        <h4 class="text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
          <i data-lucide="check-circle-2" class="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400"></i>What gets built
        </h4>
        <ul class="mt-3 space-y-2 text-sm text-zinc-700 dark:text-zinc-300 list-none p-0">
          <li class="flex items-start gap-2"><i data-lucide="check" class="w-3.5 h-3.5 mt-0.5 shrink-0 text-emerald-600 dark:text-emerald-400"></i><span>Drone types schema tests</span></li>
          <li class="flex items-start gap-2"><i data-lucide="check" class="w-3.5 h-3.5 mt-0.5 shrink-0 text-emerald-600 dark:text-emerald-400"></i><span>Drone DTO validation tests</span></li>
          <li class="flex items-start gap-2"><i data-lucide="check" class="w-3.5 h-3.5 mt-0.5 shrink-0 text-emerald-600 dark:text-emerald-400"></i><span>Drone Entity validation tests</span></li>
        </ul>
      </div>
      <div>
        <h4 class="text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
          <i data-lucide="x-circle" class="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-500"></i>Not in this milestone
        </h4>
        <ul class="mt-3 space-y-2 text-sm text-zinc-500 dark:text-zinc-400 list-none p-0">
          <li class="flex items-start gap-2"><i data-lucide="minus" class="w-3.5 h-3.5 mt-0.5 shrink-0"></i><span>Shared domain (Primitives, Telemetry)</span></li>
        </ul>
      </div>
    </div>
    <div class="mt-5 rounded-md border-l-4 border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30 p-4 text-sm text-emerald-900 dark:text-emerald-200">
      <p class="flex items-start gap-2"><i data-lucide="flag" class="w-4 h-4 mt-0.5 shrink-0"></i><span><span class="font-semibold">Done when:</span> All drone-specific schema tests pass.</span></p>
    </div>
  </div>
</article>

<footer class="pt-8 border-t border-zinc-200 dark:border-zinc-800 text-xs text-zinc-500 dark:text-zinc-400">
  Generated by <span class="font-medium">bm-prd-creator</span>. Open the milestone-1 <code class="font-mono">prompt.md</code> to start building.
</footer>
