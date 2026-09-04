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
  let taskName = baseType;

  /**
   * Init type name i.e. ENVITask<any> or IDLTask<any>
   */
  let typeName = 'any';

  // try to extract
  const match = TASK_REGEX.exec(baseType);
  if (match !== null) {
    taskName = match[1];
    typeName = taskName;
  }

  // populate and return
  if (baseType.toLowerCase().startsWith('envi')) {
    return {
      type: 'ENVITask',
      display: `ENVITask<${typeName}>`,
      taskName,
    };
  } else {
    return {
      type: 'IDLTask',
      display: `IDLTask<${typeName}>`,
      taskName,
    };
  }
}
