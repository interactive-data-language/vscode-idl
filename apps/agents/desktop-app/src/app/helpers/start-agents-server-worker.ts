import { GetExtensionPath } from '@idl/idl/files';
import { IStartAgentsServerResult } from '@idl/mcp/standalone-server';
import { IAgentServerConfig } from '@idl/types/agents';
import { app } from 'electron';
import { existsSync } from 'fs';
import { join } from 'path';
import { arch, platform } from 'process';
import { Worker } from 'worker_threads';

/** Console methods we mirror worker log messages through */
type ConsoleMethod = 'error' | 'log' | 'warn';

/** How long we wait for a graceful shutdown before force-terminating the worker */
const STOP_TIMEOUT_MS = 5000;

/** Message our worker sends us once logging should be mirrored to our console */
interface ILogMessage {
  args: any[];
  level: ConsoleMethod;
  type: 'log';
}

/** Message our worker sends us once the server is listening */
interface IReadyMessage {
  port: number;
  type: 'ready';
}

/** Message our worker sends us if it fails to start the server */
interface IErrorMessage {
  message: string;
  type: 'error';
}

type WorkerMessage = IErrorMessage | ILogMessage | IReadyMessage;

/**
 * Finds the Copilot runtime in a packaged app, where the server cannot
 * resolve it from node_modules on its own. Returned to the server via
 * the `COPILOT_CLI_PATH` environment variable.
 */
function GetPackagedCopilotPath(): string | undefined {
  if (!app.isPackaged) {
    return undefined;
  }

  const key = `${platform}-${arch}`;
  const tail = [
    'node_modules',
    `@github/copilot-sdk-${key}`,
    'prebuilds',
    key,
    platform === 'win32' ? 'copilot-runtime.exe' : 'copilot-runtime',
  ];

  // asar unpacked, asar disabled, then node_modules directly under resources
  return [
    join(process.resourcesPath, 'app.asar.unpacked', ...tail),
    join(process.resourcesPath, 'app', ...tail),
    join(process.resourcesPath, ...tail),
  ].find((candidate) => existsSync(candidate));
}

/**
 * Posts a "stop" message to our worker and waits for it to exit gracefully,
 * force-terminating it if it does not exit within `STOP_TIMEOUT_MS`
 */
function StopWorker(worker: Worker): Promise<void> {
  return new Promise((resolve) => {
    const onExit = () => {
      clearTimeout(timeout);
      resolve();
    };

    const timeout = setTimeout(() => {
      worker.off('exit', onExit);
      worker.terminate().finally(resolve);
    }, STOP_TIMEOUT_MS);

    worker.once('exit', onExit);
    worker.postMessage({ type: 'stop' });
  });
}

/**
 * Starts the agents server in a worker thread instead of in the Electron main
 * process, which otherwise runs into issues with the server process and socket
 * messages when handled directly on the main thread.
 *
 * Returns the same shape as `StartAgentsServer` so it is a drop-in replacement.
 */
export function StartAgentsServerInWorker(
  config: IAgentServerConfig,
): Promise<IStartAgentsServerResult> {
  return new Promise((resolve, reject) => {
    const file = GetExtensionPath('dist/apps/agents/server/main.js');

    // duplicate env
    const env = { ...process.env };

    try {
      env.NODE_PATH = join(
        process.resourcesPath, // "resources"
        'app.asar.unpacked',
        'node_modules',
      );
    } catch (err) {
      // do nothing
    }

    const copilotPath = GetPackagedCopilotPath();
    if (copilotPath !== undefined) {
      env.COPILOT_CLI_PATH = copilotPath;
    }

    /**
     * Start the worker
     */
    const worker = new Worker(file, {
      workerData: {
        port: config.server.port,
      },
      stdout: true,
      stderr: true,
      env,
    });

    // drain or ignore streams to ensure buffers never fill:
    worker.stdout.on('data', () => {
      // do nothing
    });
    worker.stderr.on('data', () => {
      // do nothing
    });

    let ready = false;

    worker.on('message', (raw: string) => {
      const msg: WorkerMessage = JSON.parse(raw);
      switch (msg.type) {
        case 'error':
          if (!ready) {
            reject(new Error(msg.message));
          } else {
            console.error('[agents-server] Error from worker:', msg.message);
          }
          break;
        case 'log':
          console[msg.level](...msg.args);
          break;
        case 'ready':
          ready = true;
          resolve({ port: msg.port, stop: () => StopWorker(worker) });
          break;
      }
    });

    worker.on('error', (err) => {
      if (!ready) {
        reject(err);
      } else {
        console.error('[agents-server] Worker error:', err);
      }
    });

    worker.on('exit', (code) => {
      if (!ready) {
        reject(new Error(`Worker exited with code ${code} before starting`));
      } else if (code !== 0) {
        console.error(`[agents-server] Worker exited with code ${code}`);
      }
    });
  });
}
