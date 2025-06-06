import {
  GlobalStructureToken,
  IGlobalIndexedToken,
  TASK_REGEX,
} from '@idl/types/core';
import {
  MCP_TOOL_LOOKUP,
  MCPTool_RunENVITask,
  MCPToolParams,
  MCPToolResponse,
} from '@idl/types/mcp';
import { LANGUAGE_SERVER_MESSAGE_LOOKUP } from '@idl/vscode/events/messages';
import { VSCodeLanguageServerMessenger } from '@idl/vscode/events/server';
import { ZodRawShape } from 'zod';

import { CreateENVIMCPParameter } from '../helpers/envi-parameters/create-envi-mcp-parameter';
import { GetCleanDescription } from '../helpers/get-clean-description';
import { MCPToolRegistry } from '../mcp-tool-registry.class';

/**
 * Registers a tool that can run an ENVI Task
 */
export function RegisterToolRunENVITask(
  messenger: VSCodeLanguageServerMessenger,
  task: IGlobalIndexedToken<GlobalStructureToken>,
  taskId: string // ID for task if we dont want to use names for shorter tools
) {
  /** Get the task name */
  const taskName = TASK_REGEX.exec(task.meta.display)[1];

  /** Get task description */
  const description = GetCleanDescription(task.meta.docs);

  /**
   * If there is no description, return since we need one to run tools
   */
  if (!description.trim()) {
    console.log(`Unable to add MCP tool without discription`, task);
    return;
  }

  /**
   * Map the task to a tool
   */
  const args: ZodRawShape = {};

  /** Get task properties */
  const props = task.meta.props;

  /** Get names of properties */
  const names = Object.keys(props);

  // map them in!
  for (let i = 0; i < names.length; i++) {
    const prop = props[names[i]];

    // skip if not input dataset
    if (prop.direction !== 'in') {
      continue;
    }

    // skip private parameters
    if (prop.private) {
      continue;
    }

    /** Get cleaned parameter docs */
    const docs = GetCleanDescription(prop.docs); // markdownToTxt(prop.docs);

    /** Make zod parameter */
    const param = CreateENVIMCPParameter(names[i], docs, prop.type);

    // check if unknown parameter
    if (!param) {
      // console.log(`Unhandled task "${task.name}" with parameter`, prop);
      return;
    }

    // save parameter
    args[names[i]] = param;
  }

  MCPToolRegistry.tool(
    `et-${taskName}`,
    description,
    args,
    async (id, inputParameters) => {
      // strictly typed parameters and make sure we always have content in the cells
      const params: MCPToolParams<MCPTool_RunENVITask> = {
        taskName,
        inputParameters,
      };

      const resp = (await messenger.sendRequest(
        LANGUAGE_SERVER_MESSAGE_LOOKUP.MCP,
        {
          id,
          tool: MCP_TOOL_LOOKUP.RUN_ENVI_TASK,
          params,
        }
      )) as MCPToolResponse<MCPTool_RunENVITask>;

      return {
        content: [
          {
            type: 'text',
            text: `Tool execution status: ${JSON.stringify(resp)}`,
          },
          {
            type: 'text',
            text: `Task outputs: ${JSON.stringify(resp.outputParameters)}`,
          },
        ],
      };
    }
  );
}
