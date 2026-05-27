import { IDL_MCP_LOG } from '@idl/logger';
import { ExecuteIDLCode } from '@idl/mcp/idl';
import { IDL_TRANSLATION } from '@idl/translation';
import {
  MCPTool_ExecuteIDLCode,
  MCPToolParams,
  MCPToolResponse,
} from '@idl/types/mcp';
import { LANGUAGE_SERVER_MESSENGER } from '@idl/vscode/client';
import { LANGUAGE_SERVER_MESSAGE_LOOKUP } from '@idl/vscode/events/messages';
import { IDL_LOGGER } from '@idl/vscode/logger';

import { MCP_EXECUTION_BACKEND } from '../../initialize-mcp-vscode';

/**
 * Executes IDL code (VS Code wrapper)
 */
export async function RunMCPTool_ExecuteIDLCode(
  id: string,
  params: MCPToolParams<MCPTool_ExecuteIDLCode>,
): Promise<MCPToolResponse<MCPTool_ExecuteIDLCode>> {
  return ExecuteIDLCode(MCP_EXECUTION_BACKEND, params, async (code) => {
    const resp = await LANGUAGE_SERVER_MESSENGER.sendRequest(
      LANGUAGE_SERVER_MESSAGE_LOOKUP.PREPARE_IDL_CODE,
      { code },
    );

    if (!resp) {
      IDL_LOGGER.log({
        type: 'error',
        log: IDL_MCP_LOG,
        content: [IDL_TRANSLATION.notebooks.errors.failedCodePrepare],
        alert: IDL_TRANSLATION.mcp.errors.failedCodePrepare,
      });
      return undefined;
    }

    IDL_LOGGER.log({
      type: 'debug',
      log: IDL_MCP_LOG,
      content: ['Prepared code', resp.code.split(/\r*\n/gim)],
    });

    return resp;
  });
}
