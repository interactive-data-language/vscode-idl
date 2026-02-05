import { Sleep } from '@idl/shared/extension';
import {
  MCPTool_ManageENVIAndIDLSession,
  MCPToolParams,
  MCPToolResponse,
} from '@idl/types/mcp';
import { IDL_DEBUG_ADAPTER } from '@idl/vscode/debug';

import { VSCodeSendMCPNotification } from '../helpers/vscode-send-mcp-notification';
import { RunMCPTool_StartENVI } from './envi/run-mcp-tool-start-envi';
import { RunMCPTool_StartIDL } from './idl/run-mcp-tool-start-idl';

/**
 * Manages ENVI and IDL session
 */
export async function RunMCPTool_ManageENVIAndIDLSession(
  id: string,
  params: MCPToolParams<MCPTool_ManageENVIAndIDLSession>
): Promise<MCPToolResponse<MCPTool_ManageENVIAndIDLSession>> {
  // Check if IDL is running
  if (!IDL_DEBUG_ADAPTER.isStarted()) {
    return {
      success: false,
      err: 'No active IDL or ENVI session to stop',
    };
  }

  VSCodeSendMCPNotification(id, {
    message: 'Stopping IDL session',
  });

  // Stop the session
  IDL_DEBUG_ADAPTER.terminate();

  // if we are only stopping, then stop
  if (params.action === 'stop') {
    return {
      success: true,
      idlOutput: 'ENVI and IDL session stopped successfully',
    };
  }

  // short pause for everything to catch up
  // we have to do the same thing in our tests
  await Sleep(1000);

  /**
   * Start IDL
   */
  const idlStart = await RunMCPTool_StartIDL(id, {});

  // check action or failure and return if needed
  if (params.action === 'restart-idl' && !idlStart.success) {
    return idlStart;
  }

  return RunMCPTool_StartENVI(id, {
    headless: params.action === 'restart-envi-headless' ? true : false,
  });
}
