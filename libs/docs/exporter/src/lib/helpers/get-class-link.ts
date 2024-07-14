import { TASK_REGEX } from '@idl/types/core';

import { DOCS_BASE } from '../docs-exporter.interface';
import { DOCS_PATHS } from '../folder-map.interface';

/**
 * Gets the link for a class
 */
export function GetClassLink(name: string) {
  const taskMatch = TASK_REGEX.exec(name);

  /**
   * Do we have a task?
   */
  if (taskMatch !== null) {
    /** Get the name of the task */
    const taskName = taskMatch[1].toLowerCase();
    /**
     * Is it an ENVI task?
     */
    if (name.toLowerCase().startsWith('envi')) {
      return `${DOCS_BASE}/${DOCS_PATHS.ENVI_TASK}/${taskName}.md`;
    } else {
      return `${DOCS_BASE}/${DOCS_PATHS.IDL_TASK}/${taskName}.md`;
    }
  } else {
    return `${DOCS_BASE}/${DOCS_PATHS.CLASS}/${name}.md`;
  }
}
