import { MCPTaskRegistry } from '@idl/mcp/tasks';
import { IDL_TRANSLATION } from '@idl/translation';
import {
  MCP_TOOL_LOOKUP,
  MCPTool_IDLReturnNotes,
  MCPToolResponse,
} from '@idl/types/mcp';
import { LANGUAGE_SERVER_MESSAGE_LOOKUP } from '@idl/vscode/events/messages';
import { VSCodeLanguageServerMessenger } from '@idl/vscode/events/server';
import { z } from 'zod';

import { MCPToolRegistry } from '../../mcp-tool-registry.class';
import { ENVI_TASK_INSTRUCTIONS } from './envi-task-instructions.interface';

let LOADED_NOTES = false;

/**
 * Registers a tool that can run an ENVI Task
 */
export function RegisterMCPTool_ENVIGetTaskParameters(
  messenger: VSCodeLanguageServerMessenger,
  registry: MCPTaskRegistry
) {
  MCPToolRegistry.registerTool(
    MCP_TOOL_LOOKUP.ENVI_GET_TASK_PARAMETERS,
    IDL_TRANSLATION.mcp.tools.displayNames[
      MCP_TOOL_LOOKUP.ENVI_GET_TASK_PARAMETERS
    ],
    `Returns the parameters required to run an ENVI Tool. This should *ALWAYS* be used before ${MCP_TOOL_LOOKUP.ENVI_RUN_TASK}. Here's the process to use these input parameters:\n\n ${ENVI_TASK_INSTRUCTIONS}`,
    {
      taskName: z
        .string()
        .describe('Specify an ENVI Task to return the parameter schema for'),
    },
    async (id, inputParameters) => {
      if (!registry.hasTask(inputParameters.taskName)) {
        return {
          content: [
            {
              type: 'text',
              text: `Task with name ${inputParameters.taskName} is not known, did it come from the tool ${MCP_TOOL_LOOKUP.ENVI_LIST_TASKS}?`,
            },
          ],
        };
      }

      // load notes if we havent yet
      if (!LOADED_NOTES) {
        const resp = (await messenger.sendRequest(
          LANGUAGE_SERVER_MESSAGE_LOOKUP.MCP,
          {
            id,
            tool: MCP_TOOL_LOOKUP.IDL_RETURN_NOTES,
            params: {},
          }
        )) as MCPToolResponse<MCPTool_IDLReturnNotes>;

        // mark as loaded, even if we have an error
        LOADED_NOTES = true;

        // try to load based on the response
        if (resp.success) {
          registry.addNotesForManyTasks(resp.notes.envi);
        }
      }

      /** Get detail for our task */
      const detail = registry.getTaskDetail(inputParameters.taskName);

      // create content
      const content = [
        {
          type: 'text',
          text: JSON.stringify(detail.inputParameters),
        },
        {
          type: 'text',
          text: JSON.stringify(detail.outputParameters),
        },
      ];

      // check for notes
      if (Array.isArray(detail.notes)) {
        content.push({
          type: 'text',
          text: `Key notes for running the tool: ${JSON.stringify(
            detail.notes
          )}`,
        });
      }

      // override type, gets mad with the extra push
      return {
        content: content as any,
      };
    }
  );
}
