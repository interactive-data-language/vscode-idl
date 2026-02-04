import { IDL_TRANSLATION } from '@idl/translation';
import {
  MCP_TOOL_LOOKUP,
  MCPTool_ExecuteIDLFile,
  MCPToolParams,
} from '@idl/types/mcp';
import { LANGUAGE_SERVER_MESSAGE_LOOKUP } from '@idl/vscode/events/messages';
import { VSCodeLanguageServerMessenger } from '@idl/vscode/events/server';
import { z } from 'zod';

import { MCPToolRegistry } from '../../mcp-tool-registry.class';
import { EXECUTE_IDL_FILE_DESCRIPTION } from './register-mcp-tool-execute-idl-file.interface';

/**
 * Registers a tool that runs a file of IDL code
 */
export function RegisterMCPTool_ExecuteIDLFile(
  messenger: VSCodeLanguageServerMessenger
) {
  MCPToolRegistry.registerTool(
    MCP_TOOL_LOOKUP.EXECUTE_IDL_FILE,
    {
      title:
        IDL_TRANSLATION.mcp.tools.displayNames[
          MCP_TOOL_LOOKUP.EXECUTE_IDL_FILE
        ],
      description: EXECUTE_IDL_FILE_DESCRIPTION,
      inputSchema: {
        uri: z
          .string()
          .describe(
            'The fully-qualified path to a file on disk that contains IDL code that should run.'
          ),
      },
    },
    async (id, { uri }) => {
      // strictly typed parameters
      const params: MCPToolParams<MCPTool_ExecuteIDLFile> = {
        uri,
      };

      const resp = await messenger.sendRequest(
        LANGUAGE_SERVER_MESSAGE_LOOKUP.MCP,
        {
          id,
          tool: MCP_TOOL_LOOKUP.EXECUTE_IDL_FILE,
          params,
        }
      );

      return {
        isError: !resp.success,
        content: [
          {
            type: 'text',
            text: JSON.stringify(resp),
          },
        ],
      };
    }
  );
}
