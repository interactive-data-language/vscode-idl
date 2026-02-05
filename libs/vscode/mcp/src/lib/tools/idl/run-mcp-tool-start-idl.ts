import {
  MCPTool_StartIDL,
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
  params: MCPToolParams<MCPTool_StartIDL>
): Promise<MCPToolResponse<MCPTool_StartIDL>> {
  VSCodeSendMCPNotification(id, {
    message: 'Starting IDL session',
  });

  /**
   * Start IDL
   */
  const started = await StartIDL();

  return { success: started.started, err: started.reason };
}
