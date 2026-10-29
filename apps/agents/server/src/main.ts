import {
  type IConfigProblem,
  type IStartAgentsServerResult,
  LoadConfig,
  LOG_MANAGER,
  StartAgentsServer,
  UpdateConfig,
  ValidateConfig,
} from '@idl/mcp/agents-server';
import type { IAgentServerConfig } from '@idl/types/agents';
import { existsSync } from 'fs';
import { isAbsolute } from 'path';
import { isMainThread, parentPort, workerData } from 'worker_threads';

import {
  AGENTS_SERVER_PROTOCOL_VERSION,
  type AgentsServerLogLevel,
  type AgentsServerMessage,
  type AgentsServerRequest,
} from './protocol.interface';

/**
 * Message wrapper which manually serializes/deserialze on the main
 */
function PostMessage(msg: AgentsServerMessage) {
  try {
    parentPort?.postMessage(JSON.stringify(msg));
  } catch (err) {
    // content that cannot be serialized (i.e. circular) must not take us down
    parentPort?.postMessage(
      JSON.stringify({
        type: 'log',
        level: 'warn',
        log: 'idl-agent-server',
        content: [`Unable to serialize "${msg.type}" message`],
      }),
    );
  }
}

/**
 * Prints config problems for users running the server directly
 */
function PrintProblems(problems: IConfigProblem[]) {
  console.error('[server] Unable to start, fix these problems and try again:');
  for (let i = 0; i < problems.length; i++) {
    console.error(`  [${problems[i].code}] ${problems[i].message}`);
  }
}

/**
 * Parses a message from our host, returns undefined if it is not one we can handle
 */
function ParseRequest(raw: unknown): AgentsServerRequest | undefined {
  try {
    const msg = typeof raw === 'string' ? JSON.parse(raw) : raw;
    return typeof msg?.type === 'string' ? msg : undefined;
  } catch (err) {
    return undefined;
  }
}

/**
 * Gets the value of the "--config <path>" or "--config=<path>" CLI argument
 */
function GetConfigArg(argv: string[]): string | undefined {
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--config') {
      return argv[i + 1] || '';
    }
    if (argv[i].startsWith('--config=')) {
      return argv[i].substring('--config='.length);
    }
  }
  return undefined;
}

/**
 * Starts the agents server when run directly (i.e. not spawned as a worker thread)
 *
 * Optional argument: `--config <fully qualified path to config file>`
 */
async function main() {
  try {
    const configFile = GetConfigArg(process.argv.slice(2));

    // LoadConfig silently falls back to defaults, which is not what a user expects when they pass a file
    if (configFile !== undefined) {
      if (!isAbsolute(configFile)) {
        console.error(
          `[server] --config requires a fully qualified path, received "${configFile}"`,
        );
        process.exit(1);
      }
      if (!existsSync(configFile)) {
        console.error(`[server] Config file not found: ${configFile}`);
        process.exit(1);
      }
    }

    const config = await LoadConfig(configFile);
    config.server.port = 3000;

    const problems = ValidateConfig(config);
    if (problems.length > 0) {
      PrintProblems(problems);
      process.exit(1);
    }

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
 * Runs the server as a worker thread that a host (Node or Electron) controls
 * with the messages in `protocol.interface.ts`.
 *
 * Nothing heavy happens until the host sends `start`, so the host can inspect
 * and fix the config first. Logs are forwarded to the host as `log` messages.
 */
async function mainAsWorker() {
  if (parentPort === null) {
    console.error('[server] No parent port, expected to be in a worker thread');
    process.exit(1);
  }

  // forward structured logs from our log manager
  LOG_MANAGER.setInterceptor((options) => {
    PostMessage({
      type: 'log',
      level: options.type || 'info',
      log: options.log || '',
      content: Array.isArray(options.content)
        ? options.content
        : [options.content],
    });
  });

  // forward anything else that writes to the console
  const forwardConsole = (level: AgentsServerLogLevel) => {
    return (...args: unknown[]) => {
      PostMessage({ type: 'log', level, log: 'console', content: args });
    };
  };
  console.log = forwardConsole('log');
  console.warn = forwardConsole('warn');
  console.error = forwardConsole('error');

  // hosts pick where the config lives with `new Worker(file, { workerData: { configFile } })`
  const configFile: string | undefined =
    typeof workerData?.configFile === 'string' && workerData.configFile !== ''
      ? workerData.configFile
      : undefined;

  let config: IAgentServerConfig = await LoadConfig(configFile);
  let server: IStartAgentsServerResult | undefined;
  let starting: Promise<IStartAgentsServerResult> | undefined;

  const handle = async (msg: AgentsServerRequest) => {
    try {
      switch (msg.type) {
        case 'get-config':
          PostMessage({ type: 'config', id: msg.id, config });
          break;

        case 'start': {
          if (starting !== undefined) {
            PostMessage({
              type: 'error',
              id: msg.id,
              code: 'ALREADY_STARTED',
              message: 'The server has already been started',
            });
            break;
          }

          if (msg.overrides?.host !== undefined) {
            config.server.host = msg.overrides.host;
          }
          if (msg.overrides?.port !== undefined) {
            config.server.port = msg.overrides.port;
          }

          const problems = ValidateConfig(config);
          if (problems.length > 0) {
            PostMessage({
              type: 'error',
              id: msg.id,
              code: 'INVALID_CONFIG',
              message: 'The config has problems that must be fixed first',
              problems,
            });
            break;
          }

          starting = StartAgentsServer(config);
          try {
            server = await starting;
          } catch (err) {
            // a failed start can leave partial state, so the host must make a new worker
            PostMessage({
              type: 'error',
              id: msg.id,
              code: 'START_FAILED',
              message: err instanceof Error ? err.message : String(err),
            });
            process.exit(1);
          }
          PostMessage({ type: 'ready', id: msg.id, port: server.port });
          break;
        }

        case 'stop':
          try {
            await starting;
            await server?.stop();
          } finally {
            process.exit(0);
          }
          break;

        case 'update-config':
          if (starting !== undefined) {
            PostMessage({
              type: 'error',
              id: msg.id,
              code: 'ALREADY_STARTED',
              message: 'Restart the server to apply config changes',
            });
            break;
          }
          config = UpdateConfig(config, msg.config, configFile);
          PostMessage({ type: 'config', id: msg.id, config });
          break;

        case 'validate':
          PostMessage({
            type: 'validation',
            id: msg.id,
            problems: ValidateConfig(config),
          });
          break;

        default:
          // ignore messages from newer hosts
          break;
      }
    } catch (err) {
      PostMessage({
        type: 'error',
        id: 'id' in msg ? msg.id : undefined,
        code: 'REQUEST_FAILED',
        message: err instanceof Error ? err.message : String(err),
      });
    }
  };

  parentPort.on('message', (raw: unknown) => {
    const msg = ParseRequest(raw);
    if (msg !== undefined) {
      handle(msg);
    }
  });

  PostMessage({
    type: 'hello',
    protocolVersion: AGENTS_SERVER_PROTOCOL_VERSION,
  });
}

if (isMainThread) {
  main();
} else {
  mainAsWorker();
}
