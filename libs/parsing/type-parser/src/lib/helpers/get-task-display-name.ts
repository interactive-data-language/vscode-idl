import { TASK_REGEX } from '../parsing/parse-idl-type.interface';

/**
 * Get task display name information
 */
export function GetTaskDisplayName(baseType: string) {
  const typeArgs = TASK_REGEX.exec(baseType)[1];
  if (baseType.toLowerCase().startsWith('envi')) {
    return {
      type: 'ENVITask',
      display: `ENVITask<${typeArgs}>`,
    };
  } else {
    return {
      type: 'IDLTask',
      display: `IDLTask<${typeArgs}>`,
    };
  }
}
