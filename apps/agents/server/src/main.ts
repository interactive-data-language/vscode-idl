import { LoadConfig, StartAgentsServer } from '@idl/mcp/standalone-server';
import { isMainThread, parentPort, workerData } from 'worker_threads';

/**
 * Message wrapper which manually serializes/deserialze on the main
 */
function PostMessage(msg: any) {
  parentPort?.postMessage(JSON.stringify(msg));
}

/**
 * Starts the agents server when run directly (i.e. not spawned as a worker thread)
 */
async function main() {
  try {
    const config = await LoadConfig();
    config.server.port = 3000;

    const result = await StartAgentsServer(config);

    // Graceful shutdown — stop the server so on-disk state flushes
    const shutdown = async (signal: NodeJS.Signals) => {
      console.log(`[server] Received ${signal}, shutting down...`);
      await result.stop();
      process.exit(0);
    };
    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
}

/**
 * Starts the agents server when spawned as a worker thread (i.e. from the Electron
 * desktop app) — the port comes from `workerData` and console output is piped to
 * our parent thread instead of stdout, since the worker's stdout is not surfaced
 */
async function mainAsWorker() {
  if (parentPort === null) {
    console.error('[server] No parent port, expected to be in a worker thread');
    process.exit(1);
  }

  // pipe all console output to our parent thread
  console.log = (...args: any[]) => {
    PostMessage({ type: 'log', level: 'log', args });
  };
  console.warn = (...args: any[]) => {
    PostMessage({ type: 'log', level: 'warn', args });
  };
  console.error = (...args: any[]) => {
    PostMessage({ type: 'log', level: 'error', args });
  };

  try {
    // see ConfigureModulePaths above
    throw new Error('Address bundling issue when running as web worker');

    const config = await LoadConfig();
    config.server.port = (workerData as { port: number }).port;

    const result = await StartAgentsServer(config);

    PostMessage({ type: 'ready', port: result.port });

    // our parent process tells us when to gracefully shut down
    parentPort?.on('message', async (msg: { type: string }) => {
      if (msg?.type === 'stop') {
        await result.stop();
        process.exit(0);
      }
    });
  } catch (err: any) {
    PostMessage({
      type: 'error',
      message: err?.message ?? String(err),
    });
    process.exit(1);
  }
}

if (isMainThread) {
  main();
} else {
  mainAsWorker();
}
