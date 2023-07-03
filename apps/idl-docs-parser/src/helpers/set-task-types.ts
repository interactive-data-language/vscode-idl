import {
  GLOBAL_TOKEN_TYPES,
  GlobalStructureToken,
  GlobalTokens,
  IGlobalIndexedToken,
} from '@idl/data-types/core';
import { TaskToGlobalToken } from '@idl/data-types/tasks';
import { LoadTask } from '@idl/schemas/tasks';
import { TASK_FILE_EXTENSION, TASK_FILE_GLOB_PATTERN } from '@idl/shared';
import * as glob from 'fast-glob';
import { basename, join } from 'path';

import { ENVI_DIR } from '../idl-dir.interface';

/**
 * Processes all of our global tokens and properly sets the data type for task files
 */
export async function SetTaskTypes(global: GlobalTokens) {
  // find task files
  const taskFiles = (await glob(TASK_FILE_GLOB_PATTERN, { cwd: ENVI_DIR })).map(
    (file) => join(ENVI_DIR, file)
  );

  // store as object with base name of task file
  const byName: { [key: string]: string } = {};
  for (let i = 0; i < taskFiles.length; i++) {
    byName[basename(taskFiles[i], TASK_FILE_EXTENSION).toLowerCase()] =
      taskFiles[i];
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
        name !== 'envitask'
      ) {
        /** Get the name of the task */
        const taskName = name.substring(4, name.length - 4);

        // check if we have a match
        if (taskName in byName) {
          const uri = byName[taskName];

          try {
            // load task and validate our schema
            const task = await LoadTask(uri);

            // get globals from task
            const taskGlobals = TaskToGlobalToken(task);

            // get first global, always structure from our routines
            const struct =
              taskGlobals[0] as IGlobalIndexedToken<GlobalStructureToken>;

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
          } catch (err) {
            // do nothing
          }
        }
      }
    }
  }
}
