import { TASK_REGEX } from '@idl/types/core';

import { SKIP_THESE_TASKS } from './filter-mcp-envi-tasks.interface';

export function FilterMCPENVITasks(taskNames: string[]) {
  /**
   * Task names start with "envi" and end with "task" so we have to filter with
   * that assumption in mind
   */
  return taskNames.filter((className) => {
    /** Flag if we keep or not */
    let flag = false;

    /** Skip non-envi tasks */
    if (
      !(className.startsWith('envi') && className.endsWith('task')) ||
      className === 'envitask'
    ) {
      return flag;
    }

    /** Get task name */
    const taskName = TASK_REGEX.exec(className)[1];

    /**
     * Cases that we return from
     */
    switch (true) {
      // exluced any of the extract routines which we dont need
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
  });
}
