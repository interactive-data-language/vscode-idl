import { IDL_MCP_LOG, LogManager } from '@idl/logger';
import { IDLTypeHelper, TASK_REGEX } from '@idl/parsing/type-parser';
import {
  GlobalStructureToken,
  IGlobalIndexedToken,
} from '@idl/types/idl-data-types';
import { z, ZodRawShape } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';

import {
  INPUT_PARAMETER_LOOKUP,
  OUTPUT_PARAMETER_LOOKUP,
} from '../tools/envi/register-mcp-tool-envi-get-task-parameters';
import { TASK_LOOKUP } from '../tools/envi/register-mcp-tool-envi-list-tasks';
import { TASK_FILE_LOOKUP } from '../tools/envi/register-mcp-tool-envi-run-task';
import { CreateENVIMCPParameter } from './envi-parameters/create-envi-mcp-parameter';
import { GetCleanDescription } from './get-clean-description';

/**
 * Registers a tool that can run an ENVI Task
 */
export function TrackENVITaskForMCPServer(
  task: IGlobalIndexedToken<GlobalStructureToken>,
  logger: LogManager
) {
  /** Get the task name */
  const taskName = TASK_REGEX.exec(task.meta.display)[1];

  /** Get short task description */
  const description = GetCleanDescription(task.meta.docs);

  /**
   * If there is no description, return since we need one to run tools
   */
  if (!description.trim()) {
    logger.log({
      log: IDL_MCP_LOG,
      type: 'warn',
      content: `ENVI Tool "${taskName}" is missing description and will be skipped`,
    });
    return;
  }

  /**
   * Track input parameters
   */
  const inputArgs: ZodRawShape = {};

  /**
   * Track output parameters
   */
  const outputArgs: ZodRawShape = {};

  /** Get task properties */
  const props = task.meta.props;

  /** Get names of properties */
  const names = Object.keys(props);

  // map them in!
  for (let i = 0; i < names.length; i++) {
    const prop = props[names[i]];

    // skip private parameters
    if (prop.private) {
      continue;
    }

    /** Track args to add to */
    let addToArgs = inputArgs;

    // if output, then add to output arguments
    if (prop.direction === 'out') {
      addToArgs = outputArgs;
      continue;
    }

    /** Get cleaned parameter docs */
    const docs = GetCleanDescription(prop.docs); // markdownToTxt(prop.docs);

    /** Make zod parameter */
    const param = CreateENVIMCPParameter(names[i], docs, prop.type);

    // check if unknown parameter
    if (!param) {
      logger.log({
        log: IDL_MCP_LOG,
        type: 'warn',
        content: [
          `ENVI Tool "${taskName}" has an unhandled ENVI Task data type for property "${
            names[i]
          }" with type "${IDLTypeHelper.serializeIDLType(prop.type)}"`,
        ],
      });
      return;
    }

    // save parameter
    addToArgs[names[i]] = param;
  }

  // save in lookup
  TASK_LOOKUP[taskName] = description;

  // save parameters with full description
  INPUT_PARAMETER_LOOKUP[taskName] = zodToJsonSchema(
    z
      .object(inputArgs)
      .describe(
        `Inputs for running the tool. These *MUST* be specified based on the schema. Summary:\n\n${GetCleanDescription(
          task.meta.docs,
          false
        )}`
      )
  );

  // save parameters with full description
  OUTPUT_PARAMETER_LOOKUP[taskName] = zodToJsonSchema(
    z
      .object(outputArgs)
      .describe(
        'Outputs from running the tool. These should *NEVER* be specified and are returned.'
      )
  );

  // see if we need to track task file
  if (task.file) {
    TASK_FILE_LOOKUP[taskName] = task.file;
  }
}
