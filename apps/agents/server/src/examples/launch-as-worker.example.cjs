/**
 * Example host for the agents server running as a worker thread.
 *
 * Works the same from plain Node or from Electron's main process. It does not
 * import anything from the server, the only contract is the message protocol
 * described in docs/standalone-server/README.md.
 *
 * Usage:
 *   nx build agents-server
 *   node apps/agents/server/src/examples/launch-as-worker.example.cjs
 */
const { Worker } = require('worker_threads');
const { join } = require('path');

/** Compared against `hello.protocolVersion` */
const PROTOCOL_VERSION = 1;

const SERVER_FILE =
  process.env.AGENTS_SERVER_FILE ??
  join(__dirname, '../../../../../dist/apps/agents/server/main.js');

/**
 * Starts the worker and resolves once it says hello
 */
function LaunchAgentsServer(file, onLog) {
  return new Promise((resolve, reject) => {
    const worker = new Worker(file);
    const pending = new Map();
    let nextId = 1;
    let hello = false;

    /** Sends a request and resolves with the response that has the same id */
    const request = (type, payload = {}, timeoutMs = 30000) =>
      new Promise((res, rej) => {
        const id = nextId++;
        const timer = setTimeout(() => {
          pending.delete(id);
          rej(new Error(`Timed out waiting for "${type}"`));
        }, timeoutMs);
        pending.set(id, { resolve: res, reject: rej, timer });
        worker.postMessage(JSON.stringify({ id, type, ...payload }));
      });

    /** Asks the worker to shut down, terminating it if it does not exit in time */
    const stop = () =>
      new Promise((res) => {
        const timer = setTimeout(() => worker.terminate().finally(res), 5000);
        worker.once('exit', () => {
          clearTimeout(timer);
          res();
        });
        worker.postMessage(JSON.stringify({ type: 'stop' }));
      });

    worker.on('message', (raw) => {
      const msg = JSON.parse(raw);

      switch (msg.type) {
        case 'hello':
          if (msg.protocolVersion !== PROTOCOL_VERSION) {
            worker.terminate();
            reject(new Error(`Unsupported protocol ${msg.protocolVersion}`));
            return;
          }
          hello = true;
          resolve({ request, stop });
          break;

        case 'log':
          onLog(msg);
          break;

        default: {
          // anything else is a response, unknown types are ignored
          const entry = pending.get(msg.id);
          if (entry === undefined) {
            break;
          }
          pending.delete(msg.id);
          clearTimeout(entry.timer);
          if (msg.type === 'error') {
            entry.reject(
              Object.assign(new Error(msg.message), {
                code: msg.code,
                problems: msg.problems,
              }),
            );
          } else {
            entry.resolve(msg);
          }
        }
      }
    });

    /**
     * Cause all pending to fail/cancel
     */
    const failAll = (err) => {
      for (const { reject: fail, timer } of pending.values()) {
        clearTimeout(timer);
        fail(err);
      }
      pending.clear();
    };

    // handle error
    worker.on('error', (err) => {
      failAll(err);
      if (!hello) {
        reject(err);
      }
    });

    // handle exit
    worker.on('exit', (code) => {
      const err = new Error(`Worker exited with code ${code}`);
      failAll(err);
      if (!hello) {
        reject(err);
      }
    });
  });
}

async function main() {
  const server = await LaunchAgentsServer(SERVER_FILE, (msg) => {
    console.log(`[${msg.level}] [${msg.log}]`, ...msg.content);
  });

  const { problems } = await server.request('validate');

  if (problems.length > 0) {
    // A real host would show these to the user. Fixes are applied with
    // "update-config", which merges a partial config and saves it to disk:
    //
    //   await server.request('update-config', {
    //     config: { agent: { llm: { config: { apiKey } } } },
    //   });
    //
    // then call "validate" again.
    for (const problem of problems) {
      console.error(`[${problem.code}] ${problem.message}`);
    }
    await server.stop();
    process.exitCode = 1;
    return;
  }

  // indexing IDL code can take a while, so allow a long timeout
  const { port } = await server.request(
    'start',
    { overrides: { port: 3000 } },
    120000,
  );
  console.log(`Agents server is ready on port ${port}`);

  process.on('SIGINT', async () => {
    await server.stop();
    process.exit(0);
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
