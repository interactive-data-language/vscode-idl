import {
  MCPTool_ManageIDLAndENVISession,
  MCPToolParams,
  MCPToolResponse,
} from '@idl/types/mcp';
import { StartIDL } from '@idl/vscode/debug';

import { VSCodeSendMCPNotification } from '../../helpers/vscode-send-mcp-notification';

/**
 * Start IDL
 */
export async function RunMCPTool_StartIDL(
  id: string,
  params: MCPToolParams<MCPTool_ManageIDLAndENVISession>,
): Promise<MCPToolResponse<MCPTool_ManageIDLAndENVISession>> {
  VSCodeSendMCPNotification(id, {
    message: 'Starting IDL session',
  });

  /**
   * Start IDL
   */
  const started = await StartIDL();

  return { success: started.started, err: started.reason };
}
