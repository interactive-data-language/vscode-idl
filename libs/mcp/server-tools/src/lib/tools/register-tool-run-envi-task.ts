import {
  GlobalStructureToken,
  IDLTypeHelper,
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
import { z, ZodRawShape } from 'zod';

import { MCPENVIRaster } from '../helpers/envi-parameters/mcp-envi-raster';
import { MCPENVIVector } from '../helpers/envi-parameters/mcp-envi-vector';
import { GetCleanDescription } from '../helpers/get-clean-description';
import { MCPToolRegistry } from '../mcp-tool-registry.class';
import { SKIP_THESE_TASKS } from './register-tool-run-envi-task.interface';

/**
 * Registers a tool that can run an ENVI Task
 */
export function RegisterToolRunENVITask(
  messenger: VSCodeLanguageServerMessenger,
  task: IGlobalIndexedToken<GlobalStructureToken>,
  taskId: string // ID for task if we dont want to use names for shorter tools
) {
  // return if not an ENVI task
  if (
    !(task.name.startsWith('envi') && task.name.endsWith('task')) ||
    task.name === 'envitask'
  ) {
    return;
  }

  /**
   * Cases that we return from
   */
  switch (true) {
    // exclude anything not a task
    case !(task.name.startsWith('envi') && task.name.endsWith('task')) ||
      task.name === 'envitask':
      return;
    // exluced any of the extract routines which we dont need
    case task.name.startsWith('extract') && task.name.endsWith('fromfile'):
      return;
    default:
      break;
  }

  /** Get the task name */
  const taskName = TASK_REGEX.exec(task.meta.display)[1];

  // check if we need to skip adding these tools
  if (taskName.toLowerCase() in SKIP_THESE_TASKS) {
    return;
  }

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

  /** Defualt values */
  const defaults: { [key: string]: any } = {};

  /** Get task properties */
  const props = task.meta.props;

  /** Get names of properties */
  const names = Object.keys(props);

  /** Track unhandled parameters and return if we have unknowns */
  let unhandled = false;

  // map them in!
  for (let i = 0; i < names.length; i++) {
    const prop = props[names[i]];

    // skip if not input dataset
    if (prop.direction !== 'in') {
      continue;
    }

    /** Get cleaned parameter docs */
    const docs = GetCleanDescription(prop.docs); // markdownToTxt(prop.docs);

    /**
     * Convert to ZOD
     */
    switch (true) {
      /**
       * Handle arrays of values
       */
      case IDLTypeHelper.isType(prop.type, 'array'): {
        /** Get type arguments for arrays (i.e. Array<TypeArg>) */
        const typeArgs = IDLTypeHelper.getAllTypeArgs(prop.type);

        switch (true) {
          /**
           * Raster
           */
          case IDLTypeHelper.isType(typeArgs, 'enviraster'):
            args[names[i]] = z
              .array(MCPENVIRaster('Each raster to process'))
              .describe(docs);
            break;

          /**
           * ENVI spectral index
           */
          case IDLTypeHelper.isType(typeArgs, 'envispectralindex'):
            args[names[i]] = z.array(z.string()).describe(docs);
            break;

          /**
           * Vector
           */
          case IDLTypeHelper.isType(typeArgs, 'envivector'):
            args[names[i]] = z
              .array(MCPENVIVector('Each vector to process'))
              .describe(docs);
            break;

          /**
           * String
           */
          case IDLTypeHelper.isType(typeArgs, 'string'):
            args[names[i]] = z.array(z.string()).describe(docs);
            break;

          /**
           * bool
           */
          case IDLTypeHelper.isType(typeArgs, 'boolean'):
            args[names[i]] = z.array(z.boolean()).describe(docs);
            break;

          default:
            unhandled = true;
            break;
        }

        break;
      }

      /**
       * ENVI URI
       */
      case IDLTypeHelper.isType(prop.type, 'string') &&
        names[i].endsWith('uri'):
        defaults[names[i]] = '*';
        // args[names[i]] = z.string().describe(prop.docs).default('*');
        break;

      /**
       * Raster
       */
      case IDLTypeHelper.isType(prop.type, 'enviraster'):
        args[names[i]] = MCPENVIRaster(docs);
        break;

      /**
       * ENVI spectral index
       */
      case IDLTypeHelper.isType(prop.type, 'envispectralindex'):
        args[names[i]] = z.string().describe(docs);
        break;

      /**
       * Vector
       */
      case IDLTypeHelper.isType(prop.type, 'envivector'):
        args[names[i]] = MCPENVIVector(docs);
        break;

      /**
       * String
       */
      case IDLTypeHelper.isType(prop.type, 'string'):
        args[names[i]] = z.string().describe(docs);
        break;

      /**
       * Bool
       */
      case IDLTypeHelper.isType(prop.type, 'boolean'):
        args[names[i]] = z.boolean().describe(docs);
        break;

      default:
        unhandled = true;
        break;
    }

    // return if unhandled
    if (unhandled) {
      // console.log(`Unhandled task "${task.name}" with parameter`, prop);
      return;
    }
  }

  // return if unhandled
  if (unhandled) {
    // console.log(`Unhandled task "${task.name}" with parameter`, prop);
    return;
  }

  MCPToolRegistry.tool(
    `et-${taskName}`,
    description,
    args,
    async (id, inputParameters) => {
      // strictly typed parameters and make sure we always have content in the cells
      const params: MCPToolParams<MCPTool_RunENVITask> = {
        taskName,
        inputParameters: { ...defaults, ...inputParameters },
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
