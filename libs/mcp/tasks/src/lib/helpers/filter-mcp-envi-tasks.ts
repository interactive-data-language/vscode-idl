import { TASK_REGEX } from '@idl/parsing/type-parser';

import { SKIP_THESE_TASKS } from './filter-mcp-envi-tasks.interface';

/**
 * Filters ENVI Tasks for use in MCP
 *
 * Uses the names of structures and verifies we have a matching function
 * of the same name.
 *
 * Some are disabled/filtered because they don't make sense
 */
export function FilterMCPENVITasks(
  functions: { [key: string]: any },
  taskNames: string[]
) {
  /**
   * Task names start with "envi" and end with "task" so we have to filter with
   * that assumption in mind
   */
  return taskNames
    .filter((className) => {
      /** Flag if we keep or not */
      let flag = false;

      /** Skip non-envi tasks */
      if (
        !(className.startsWith('envi') && className.endsWith('task')) ||
        className === 'envitask'
      ) {
        return flag;
      }

      // filter if we don't have a known function
      if (!(className in functions)) {
        return false;
      }

      /** Get task name */
      const taskName = TASK_REGEX.exec(className)[1];

      /**
       * Cases that we return from
       */
      switch (true) {
        /**
         * Exclude any of the extract routines which we dont need
         *
         * Dehydrated parameters should account for these instead or dedicated
         * MCP tools
         *
         * This is code and not a static list so it is future-proof
         */
        case taskName.startsWith('extract') && taskName.endsWith('fromfile'):
          break;
        // skip tasks with names we decide not to expose as tools
        case taskName in SKIP_THESE_TASKS:
          break;
        // otherwise we keep it
        default:
          flag = true;
          break;
      }

      return flag;
    })
    .sort();
}
