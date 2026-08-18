import { RunMCPTool_StartENVISession } from '@idl/mcp/envi';
import { Sleep } from '@idl/shared/extension';
import {
  IIDLMCPExecutionBackend,
  MCPProgressCallback,
  MCPTool_ControlIDLAndENVISession,
  MCPToolParams,
  MCPToolResponse,
} from '@idl/types/mcp';

import { RunMCPTool_StartIDLSession } from './run-mcp-tool-start-idl-session';

/**
 * Core logic for controlling ENVI and IDL sessions (start/stop/restart).
 *
 * Independent of VS Code — works with any `IIDLMCPExecutionBackend`.
 */
export async function RunMCPTool_ControlIDLAndENVISession(
  backend: IIDLMCPExecutionBackend,
  params: MCPToolParams<MCPTool_ControlIDLAndENVISession>,
  onProgress?: MCPProgressCallback,
): Promise<MCPToolResponse<MCPTool_ControlIDLAndENVISession>> {
  // Check if we are starting
  switch (params.action) {
    case 'start-envi':
      return RunMCPTool_StartENVISession(backend, params, onProgress);
    // case 'start-envi-headless':
    //   return RunMCPTool_StartENVISession(backend, params, onProgress);
    case 'start-idl':
      return RunMCPTool_StartIDLSession(backend, params, onProgress);
    default:
      break;
  }

  // If not starting, then we are restarting or stopping

  if (!backend.isStarted()) {
    return {
      success: false,
      result: { err: 'No active IDL or ENVI session to stop' },
    };
  }

  onProgress?.('Stopping IDL session');

  await backend.stop();

  if (params.action === 'stop') {
    return {
      success: true,
      result: 'ENVI and IDL session stopped successfully',
    };
  }

  // short pause for everything to catch up
  await Sleep(1000);

  // determine how to restart
  switch (params.action) {
    case 'restart-envi':
      return RunMCPTool_StartENVISession(backend, params, onProgress);
    // case 'restart-envi-headless':
    //   return RunMCPTool_StartENVISession(backend, params, onProgress);
    case 'restart-idl':
      return RunMCPTool_StartIDLSession(backend, params, onProgress);
    default:
      return {
        success: false,
        result: { err: `Unknown restart option of "${params.action}"` },
      };
  }
}
