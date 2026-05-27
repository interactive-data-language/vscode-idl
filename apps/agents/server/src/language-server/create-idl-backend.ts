import { GetExtensionPath } from '@idl/idl/files';
import { IDL_DEBUG_LOG, LogManager } from '@idl/logger';
import { RegisterENVINotifyHandlers } from '@idl/mcp/envi';
import {
  IDLMCPExecutionManager,
  MCPExecutionBackend,
} from '@idl/mcp/idl-machine';
import { DEFAULT_IDL_EXTENSION_CONFIG } from '@idl/vscode/extension-config';
import { copy } from 'fast-copy';

/**
 * Creates an `MCPExecutionBackend` wired up with a launch config
 * so that IDL starts on demand when `backend.start()` is first called.
 *
 * Does **not** launch IDL eagerly — the backend holds the config and
 * `start()` will call `manager.launch()` when an MCP tool needs it.
 */
export function CreateIDLBackend(
  logManager: LogManager,
  idlBinDir: string,
): MCPExecutionBackend {
  /** Path to the auxiliary PRO files shipped with the extension */
  const vscodeProDir = GetExtensionPath('idl/vscode');

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
  const backend = new MCPExecutionBackend(
    manager,
    {
      config,
      env: process.env as { [key: string]: string },
    },
    () => {
      RegisterENVINotifyHandlers(backend, (msg) => {
        backend.lastENVISuccessMessage = msg;
      });
    },
  );

  // regi

  return backend;
}
