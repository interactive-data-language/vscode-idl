import { IDL_MCP_LOG } from '@idl/logger';
import { IMCPToolProgress } from '@idl/types/mcp';
import { LANGUAGE_SERVER_MESSENGER } from '@idl/vscode/client';
import { LANGUAGE_SERVER_MESSAGE_LOOKUP } from '@idl/vscode/events/messages';
import { IDL_LOGGER } from '@idl/vscode/logger';

/**
 * Sends a notification to the MCP server for a given tool ID
 */
export function VSCodeSendMCPNotification(
  id: string,
  progress: IMCPToolProgress
) {
  IDL_LOGGER.log({
    type: 'debug',
    log: IDL_MCP_LOG,
    content: [`Send MCP tool notification from tool ID: "${id}"`, progress],
  });

  LANGUAGE_SERVER_MESSENGER.sendNotification(
    LANGUAGE_SERVER_MESSAGE_LOOKUP.MCP_PROGRESS,
    {
      id,
      progress,
    }
  );
}
