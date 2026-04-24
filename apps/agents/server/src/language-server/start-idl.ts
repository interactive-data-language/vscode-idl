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
 * Current IDL session manager
 */
export let IDL_MANAGER: IDLMCPExecutionManager | undefined = undefined;

/**
 * Execution backend wrapping the manager — implements `IIDLExecutionBackend`
 */
export let IDL_BACKEND: MCPExecutionBackend | undefined = undefined;

/**
 * Start a session of IDL and return the execution backend.
 */
export async function StartIDL(logManager: LogManager, idlBinDir: string) {
  // return if already launched
  if (IDL_MANAGER !== undefined && IDL_BACKEND !== undefined) {
    return IDL_BACKEND;
  }

  const vscodeProDir = GetExtensionPath('idl/vscode');

  // create a new IDL manager
  IDL_MANAGER = new IDLMCPExecutionManager(
    logManager.getLog(IDL_DEBUG_LOG),
    vscodeProDir,
    {
      onReadIOLine: async () => {
        return '';
      },
    },
  );

  // create the backend wrapper
  IDL_BACKEND = new MCPExecutionBackend(IDL_MANAGER);

  // register ENVI success/failure notify handlers
  RegisterENVINotifyHandlers(IDL_BACKEND, (msg) => {
    if (IDL_BACKEND !== undefined) {
      IDL_BACKEND.lastENVISuccessMessage = msg;
    }
  });

  /**
   * Copy default launch config
   */
  const config = copy(DEFAULT_IDL_EXTENSION_CONFIG);

  // update IDL install folder location
  config.IDL.directory = idlBinDir;

  /**
   * Launch IDL
   */
  const launched = await IDL_MANAGER.launch({
    config,
    env: process.env,
  });

  if (!launched) {
    console.error('Failed to launch IDL');
  }

  return IDL_BACKEND;
}
