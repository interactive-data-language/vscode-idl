import { TASK_REGEX } from '../parsing/parse-idl-type.interface';

/**
 * Get task display name information
 */
export function GetTaskDisplayName(baseType: string) {
  /**
   * Init task name value
   *
   * This handles when our baseType = "ENVITask" or "IDLTask"
   *
   * Which can happen when we don't have global tokens loaded
   */
  let taskName = 'any';

  // try to extract
  const match = TASK_REGEX.exec(baseType);
  if (match !== null) {
    taskName = match[0];
  }

  // populate and return
  if (baseType.toLowerCase().startsWith('envi')) {
    return {
      type: 'ENVITask',
      display: `ENVITask<${taskName}>`,
      taskName,
    };
  } else {
    return {
      type: 'IDLTask',
      display: `IDLTask<${taskName}>`,
      taskName,
    };
  }
}
