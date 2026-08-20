import { USER_ENVI_WORKFLOWS_FOLDER } from '@idl/idl/files';
import { MCPServer } from '@idl/mcp/server';
import { IDL_TRANSLATION } from '@idl/translation';
import { MCP_TOOL_LOOKUP } from '@idl/types/mcp';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';
import { z } from 'zod';

import { ENVI_TOOL_WORKFLOW_REGISTRY } from './register-mcp-tool-list-envi-tool-workflows';

/**
 * Registers Save ENVI Tool Workflow
 */
export function RegisterMCPTool_SaveENVIToolWorkflow(server: MCPServer) {
  server.registerTool(
    MCP_TOOL_LOOKUP.SAVE_ENVI_TOOL_WORKFLOW,
    {
      title:
        IDL_TRANSLATION.mcp.tools.displayNames[
          MCP_TOOL_LOOKUP.SAVE_ENVI_TOOL_WORKFLOW
        ],
      description: `Saves an ENVI Tool Workflow so that it can be re-used in future sessions. The workflow name must be unique (case-insensitive). For complete instructions on how to use this tool, retrieve the prompt "enviSaveENVIToolWorkflow" from the MCP tool "${MCP_TOOL_LOOKUP.LIST_PROMPTS}".`,
      inputSchema: {
        workflowName: z
          .string()
          .describe(
            'The name of the workflow to save. Used as the file name (without extension). Should be short and descriptive.',
          ),
        workflowContent: z
          .string()
          .describe(
            'The full markdown content describing the workflow steps and instructions, following the pattern for the full instructions.',
          ),
      },
    },
    async (id, { workflowName, workflowContent }) => {
      // make sure the directory exists
      if (!existsSync(USER_ENVI_WORKFLOWS_FOLDER)) {
        mkdirSync(USER_ENVI_WORKFLOWS_FOLDER, { recursive: true });
      }

      // check for existing workflow
      if (ENVI_TOOL_WORKFLOW_REGISTRY.hasWorkflow(workflowName)) {
        return {
          isError: true,
          content: [
            {
              type: 'text',
              text: `A workflow named "${workflowName}" already exists. Choose a different name or delete the existing workflow first.`,
            },
          ],
        };
      }

      /** Full path for the new workflow file */
      const filePath = join(USER_ENVI_WORKFLOWS_FOLDER, `${workflowName}.md`);

      // write the workflow content to disk
      writeFileSync(filePath, workflowContent, 'utf-8');

      // register workflow with the agent
      ENVI_TOOL_WORKFLOW_REGISTRY.addToolWorkflowFromFile(filePath);

      return {
        isError: false,
        content: [
          {
            type: 'text',
            text: JSON.stringify({ filePath }),
          },
        ],
      };
    },
  );
}
