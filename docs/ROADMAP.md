# Roadmap

Plan for v0.1.0, assuming roughly 10 to 15 hours per week. Each week ends with something you can run or show. If time runs short, cut in this order: the mission planner, then the second (rover) source, then the MAVLink polish.

## Week 1: Foundations and contracts

- [x] Add the generic telemetry, alarm and command schemas to `@sokil/contracts`
- [ ] Add a test runner to contracts and write schema tests (valid and invalid examples)
- [ ] Backend: add a Jest config and a `test` script; change `@nestjs/testing` to `^10.3.0`
- [ ] Add a GitHub Actions workflow: install with `--frozen-lockfile`, then `turbo run lint check-types build test`
- [x] Clean `.gitignore` (use `.turbo` and `.next` without a slash so they match in every folder) and check that no build output is tracked
- [x] Replace the README

**Done when:** CI is green and the schema tests pass.

## Week 2: Simulator and ingest pipeline

- [ ] Simulated vehicle: a circular track, a draining battery, 10 Hz output as `TelemetryBatch`
- [ ] Backend ingest service that validates batches at the boundary
- [ ] WebSocket gateway that broadcasts the latest value per channel
- [ ] Docker Compose entry for the backend and the database

**Done when:** a browser console or a WebSocket client shows live values.

## Week 3: MAVLink adapter

- [ ] Run ArduPilot SITL in Docker Compose
- [ ] Map a few messages (heartbeat, attitude, global position, system status) to telemetry channels
- [ ] Reconnect with backoff, and a clear link-lost state

**Done when:** the SITL vehicle appears through the same pipeline as the simulator.

## Week 4: Live frontend

- [ ] WebSocket client and a store, with a connection status indicator
- [ ] Instrument panel: attitude, speed, altitude, battery
- [ ] Map marker and track (MapLibre or Leaflet)
- [ ] Render loop on `requestAnimationFrame`, so UI updates do not follow every message

**Done when:** a moving vehicle is visible on the map.

## Week 5: Limits, alarms and commands

- [ ] Evaluate channel limits and raise, acknowledge and clear alarms; show an alarm list
- [ ] Command lifecycle (arm, set mode, return to base) with timeouts and UI states
- [ ] Unit tests for limit evaluation and the command state machine

**Done when:** a simulated low battery raises a red alarm, and a command ends as acknowledged or timed out.

## Week 6: Recording with PostgreSQL

- [ ] Start and stop sessions; insert samples in batches
- [ ] Session list endpoint
- [ ] Range query with downsampling, so long sessions stay fast

**Done when:** you record a session, restart the backend and still see it in the list.

## Week 7: Replay timeline

- [ ] One chart per channel (uPlot or ECharts) with scrub, play, pause and rate
- [ ] Alarm and command markers on the timeline
- [ ] CSV export of a selected range

**Done when:** a recorded session replays end to end.

## Week 8: Polish and release

- [ ] Rover simulator as a second source, with no change to the core
- [ ] Screenshots or a GIF in the README, a short demo video, an architecture diagram, short decision notes
- [ ] A performance note: messages per second and p95 latency
- [ ] Stretch: mission planner with waypoint validation and upload
- [ ] Tag `v0.1.0`

**Done when:** a fresh clone starts with one command and the demo works.

## After v0.1: open source

Pick one project, such as NASA Open MCT, F Prime or Yamcs, and start small: read the contributing guide, run it locally, then fix documentation or a "good first issue". Your own telemetry model gives you real context for the discussions.
