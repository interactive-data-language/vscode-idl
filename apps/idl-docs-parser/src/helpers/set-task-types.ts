import { TaskToMarkdown } from '@idl/parsing/syntax-tree';
import { LoadTask } from '@idl/schemas/tasks';
import { TASK_FILE_GLOB_PATTERN } from '@idl/shared/extension';
import {
  GLOBAL_TOKEN_TYPES,
  GlobalFunctionToken,
  GlobalStructureToken,
  GlobalTokens,
  IGlobalIndexedToken,
} from '@idl/types/idl-data-types';
import { ParsedTask, TaskToGlobalToken } from '@idl/types/tasks';
import * as glob from 'fast-glob';
import { join } from 'path';

import { ENVI_DIR } from '../idl-dir.interface';

/**
 * Processes all of our global tokens and properly sets the data type for task files
 */
export async function SetTaskTypes(global: GlobalTokens) {
  // find task files
  const taskFiles = (await glob(TASK_FILE_GLOB_PATTERN, { cwd: ENVI_DIR })).map(
    (file) => join(ENVI_DIR, file),
  );

  // store as object with base name of task file
  const byName: { [key: string]: ParsedTask } = {};
  for (let i = 0; i < taskFiles.length; i++) {
    // wrap in try/catch because some task files dont follow the schema
    try {
      /** Parse the task */
      const task = await LoadTask(taskFiles[i]);

      // save
      byName[task.name.toLowerCase().trim()] = task;
    } catch (err) {
      console.log(`Failed to load task: ${taskFiles[i]}`);
      console.log(err);
    }
  }

  const taskFunctions: {
    [key: string]: IGlobalIndexedToken<GlobalFunctionToken>;
  } = {};

  // extract all tasks
  for (let i = 0; i < global.length; i++) {
    if (
      global[i].type === GLOBAL_TOKEN_TYPES.FUNCTION &&
      global[i].name.startsWith('envi') &&
      global[i].name.endsWith('task')
    ) {
      taskFunctions[global[i].name] = global[
        i
      ] as IGlobalIndexedToken<GlobalFunctionToken>;
    }
  }

  // process each token
  for (let i = 0; i < global.length; i++) {
    // check for structure
    if (global[i].type === GLOBAL_TOKEN_TYPES.STRUCTURE) {
      // save and type for easy access
      const globali = global[i] as IGlobalIndexedToken<GlobalStructureToken>;

      // get our name
      const name = globali.name;

      // make sure we have a task
      if (
        name.startsWith('envi') &&
        name.endsWith('task') &&
        name !== 'envitask' &&
        name !== 'idltask'
      ) {
        /** Get the name of the task */
        const taskName = name.substring(4, name.length - 4);

        // check if we have a match
        if (taskName in byName) {
          // get globals from task
          const taskGlobals = TaskToGlobalToken(byName[taskName]);

          // get first global, always structure from our routines
          const struct = taskGlobals.structure;

          // set human readable name
          globali.meta.readableName = struct.meta.readableName;

          // get properties
          const props = struct.meta?.props || {};

          // names of properties
          const names = Object.keys(props);

          // inherit types if the parameters are currently tracked
          for (let j = 0; j < names.length; j++) {
            if (names[j] in globali.meta.props) {
              globali.meta.props[names[j]].req = props[names[j]].req;
              globali.meta.props[names[j]].direction =
                props[names[j]].direction;
              globali.meta.props[names[j]].type = props[names[j]].type;
            }
          }

          // names of properties that we have tracked
          const trackedNames = Object.keys(globali.meta.props);

          // if a tracked property doesnt exist, then delete it
          for (let j = 0; j < trackedNames.length; j++) {
            if (!(trackedNames[j] in props)) {
              delete globali.meta.props[trackedNames[j]];
            }
          }
        }

        // check for matching task function
        if (name in taskFunctions) {
          taskFunctions[name].meta.docs = `${
            taskFunctions[name].meta.docs
          }\n\n${TaskToMarkdown(
            {
              name: taskFunctions[name].name,
              meta: taskFunctions[name].meta,
              taskProperties: globali,
            },
            true,
          )}`;
        }
      }
    }
  }
}
