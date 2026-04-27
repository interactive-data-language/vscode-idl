import { StartENVISession } from '@idl/mcp/envi';
import {
  IIDLExecutionBackend,
  MCPProgressCallback,
} from '@idl/mcp/idl-machine';
import { Sleep } from '@idl/shared/extension';
import {
  MCPTool_ManageIDLAndENVISession,
  MCPToolParams,
  MCPToolResponse,
} from '@idl/types/mcp';

import { StartIDLSession } from './start-idl-session';

/**
 * Core logic for managing ENVI and IDL sessions (start/stop/restart).
 *
 * Independent of VS Code — works with any `IIDLExecutionBackend`.
 */
export async function ManageENVIAndIDLSession(
  backend: IIDLExecutionBackend,
  params: MCPToolParams<MCPTool_ManageIDLAndENVISession>,
  onProgress?: MCPProgressCallback,
): Promise<MCPToolResponse<MCPTool_ManageIDLAndENVISession>> {
  // Check if we are starting
  switch (params.action) {
    case 'start-envi':
      return StartENVISession(backend, params, onProgress);
    case 'start-envi-headless':
      return StartENVISession(backend, params, onProgress);
    case 'start-idl':
      return StartIDLSession(backend, params, onProgress);
    default:
      break;
  }

  // If not starting, then we are restarting or stopping

  if (!backend.isStarted()) {
    return {
      success: false,
      err: 'No active IDL or ENVI session to stop',
    };
  }

  onProgress?.('Stopping IDL session');

  await backend.stop();

  if (params.action === 'stop') {
    return {
      success: true,
      idlOutput: 'ENVI and IDL session stopped successfully',
    };
  }

  // short pause for everything to catch up
  await Sleep(1000);

  // determine how to restart
  switch (params.action) {
    case 'restart-envi':
      return StartENVISession(backend, params, onProgress);
    case 'restart-envi-headless':
      return StartENVISession(backend, params, onProgress);
    case 'restart-idl':
      return StartIDLSession(backend, params, onProgress);
    default:
      return {
        success: false,
        err: `Unknown restart option of "${params.action}"`,
      };
  }
}
