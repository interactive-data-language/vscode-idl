import {
  GlobalStructureToken,
  IGlobalIndexedToken,
  TASK_REGEX,
} from '@idl/types/core';
import { VSCodeLanguageServerMessenger } from '@idl/vscode/events/server';
import { z, ZodRawShape } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';

import { PARAMETER_LOOKUP } from '../tools/register-tool-query-envi-task-parameters';
import { TASK_LOOKUP } from '../tools/register-tool-query-envi-tasks';
import { CreateENVIMCPParameter } from './envi-parameters/create-envi-mcp-parameter';
import { GetCleanDescription } from './get-clean-description';

/**
 * Registers a tool that can run an ENVI Task
 */
export function TrackENVITaskForMCPServer(
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
    console.log(`Unable to add MCP tool without discription: ${taskName}`);
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

    // // skip if not a requried parameter because may not need it
    // if (!prop.req) {
    //   continue
    // }

    // check if unknown parameter
    if (!param) {
      // console.log(`Unhandled task "${task.name}" with parameter`, prop);
      return;
    }

    // save parameter
    args[names[i]] = param;
  }

  // save in lookup
  TASK_LOOKUP[taskName] = description;

  // save parameters
  PARAMETER_LOOKUP[taskName] = zodToJsonSchema(z.object(args));
}
