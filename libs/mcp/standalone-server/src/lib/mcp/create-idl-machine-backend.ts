import { GetExtensionPath } from '@idl/idl/files';
import { IDL_DEBUG_LOG, LogManager } from '@idl/logger';
import { RegisterENVINotifyHandlers } from '@idl/mcp/envi';
import { IDLMCPExecutionManager } from '@idl/mcp/idl-machine';
import {
  WebSocketExecutionBackend,
  WebSocketToolBridge,
} from '@idl/mcp/websocket';
import { PrepareIDLCodeCallback } from '@idl/types/mcp';
import { DEFAULT_IDL_EXTENSION_CONFIG } from '@idl/vscode/extension-config';
import { copy } from 'fast-copy';

/**
 * Creates an `MCPExecutionBackend` wired up with a launch config
 * so that IDL starts on demand when `backend.start()` is first called.
 *
 * Does **not** launch IDL eagerly — the backend holds the config and
 * `start()` will call `manager.launch()` when an MCP tool needs it.
 *
 * The returned backend routes the small set of allowed ENVI tools through
 * `bridge` whenever a WebSocket client is connected, and runs everything
 * else through the local IDL Machine process.
 */
export function CreateIDLMachineBackend(
  logManager: LogManager,
  idlBinDir: string,
  codePrepare: PrepareIDLCodeCallback,
  bridge: WebSocketToolBridge,
): WebSocketExecutionBackend {
  /** Path to the auxiliary PRO files shipped with the extension */
  const vscodeProDir = GetExtensionPath('resources/idl/vscode');

  /** Create a new IDL manager */
  const manager = new IDLMCPExecutionManager(
    logManager.getLog(IDL_DEBUG_LOG),
    vscodeProDir,
    {
      onReadIOLine: async () => {
        return '';
      },
    },
  );

  /** Build launch config — IDL will be started on demand via backend.start() */
  const config = copy(DEFAULT_IDL_EXTENSION_CONFIG);
  (config as any).IDL.directory = idlBinDir;

  /** Create the backend wrapper */
  const backend = new WebSocketExecutionBackend(
    bridge,
    manager,
    {
      config,
      env: process.env as { [key: string]: string },
    },
    () => {
      RegisterENVINotifyHandlers(backend, (msg) => {
        backend.lastENVIMessage = msg;
      });
    },
    codePrepare,
  );

  return backend;
}
