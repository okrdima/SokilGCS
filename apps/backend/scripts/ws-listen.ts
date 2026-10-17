import { io } from 'socket.io-client';

const port = process.env.PORT || '3001';
const serverUrl = `http://localhost:${port}`;

console.log(`[ws-listen] Connecting to Telemetry Gateway at ${serverUrl}...`);

const socket = io(serverUrl, {
  transports: ['websocket'],
});

let batchCount = 0;
let lastTime = Date.now();

socket.on('connect', () => {
  console.log(`[ws-listen] Connected to server (socket id: ${socket.id})`);
});

socket.on('connect_error', (err) => {
  console.error(`[ws-listen] Connection error: ${err.message}`);
});

socket.on('session', (session) => {
  if (!session) {
    console.log('[ws-listen] Received session: null (no active session)');
    return;
  }
  console.log(
    `[ws-listen] Received session: id=${session.id}, name="${session.name}", source=${session.sourceKind}, vehicle=${session.vehicleKind}, channels=${session.channels.length}`,
  );
});

socket.on('snapshot', (snapshot) => {
  console.log(
    `[ws-listen] Received snapshot: sessionId=${snapshot.sessionId}, samplesCount=${snapshot.samples.length}`,
  );
  for (const s of snapshot.samples) {
    console.log(`  - ${s.channelId}: ${s.value}`);
  }
});

socket.on('batch', (batch) => {
  batchCount++;
  // Log sample snippet for the first batch or periodically
  if (batchCount === 1) {
    const channelNames = batch.samples.map((s: { channelId: string }) => s.channelId).join(', ');
    console.log(
      `[ws-listen] First batch received (sessionId=${batch.sessionId}, samples=${batch.samples.length}: [${channelNames}])`,
    );
  }
});

socket.on('disconnect', (reason) => {
  console.log(`[ws-listen] Disconnected: ${reason}`);
});

// Periodic throughput reporting every second
setInterval(() => {
  const now = Date.now();
  const elapsedSec = (now - lastTime) / 1000;
  if (elapsedSec > 0) {
    const rate = (batchCount / elapsedSec).toFixed(1);
    console.log(`[ws-listen] Throughput: ${rate} batches/s (${batchCount} batches in ${elapsedSec.toFixed(1)}s)`);
    batchCount = 0;
    lastTime = now;
  }
}, 1000);
