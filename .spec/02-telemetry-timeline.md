# Feature Spec: Multi-Track Telemetry Timeline & Scrubber

## 1. User Story
As a UAV Flight Analyst,
I want an interactive, DAW-style synchronized multi-track timeline,
So that I can scrub through flight telemetry and inspect precise timestamps during incident reviews.

## 2. Technical Scope & Boundaries
- **Target Package**: `apps/gcs-frontend/src/components/timeline/`
- **Primary Dependencies**: `uPlot` (Canvas rendering), React, Tailwind CSS.
- **Data Source**: Synchronized time-series telemetry array from `@sokil/contracts`.

## 3. Acceptance Criteria
- [ ] Render 4 distinct timeline tracks:
  - Track 01: Altitude (GPS MSL) & Ground Speed.
  - Track 02: Attitude Degrees (Pitch, Roll, Yaw).
  - Track 03: Power / Electrical Bus (Voltage vs Current Amps).
  - Track 04: RF Link Quality (RSSI) & Satellite Count.
- [ ] Global vertical scrubber line (Playhead) spans across all tracks simultaneously.
- [ ] Horizontal zoom (1s to 30m scale) updates all tracks synchronously.
- [ ] Scrubber movement dispatches a unified `onTimeUpdate(timestampMs)` event.
- [ ] Maintains 60 FPS rendering performance during active scrubbing with 100k+ data points.

## 4. Implementation Steps
1. Create `TimelineLayout` wrapper component with flex/grid structure.
2. Integrate `uPlot` wrapper for canvas-based time-series charts.
3. Build `PlayheadScrubber` component with synchronized X-axis positioning.
4. Implement shared state hook (`useTimelineState`) for `currentTime` and `zoomLevel`.
5. Connect event markers track (TRK 05) at the bottom.
