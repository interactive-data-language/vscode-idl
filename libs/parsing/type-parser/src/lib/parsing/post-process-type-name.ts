import {
  CUSTOM_TYPE_DISPLAY_NAMES,
  IDL_TYPE_LOOKUP,
  IDLDataType,
} from '@idl/types/idl-data-types';

/**
 * Regular expression to detect ENVI or IDL tasks so we can nicely format the display name
 */
export const TASK_NAME_REGEX = /^(?:ENVI|IDL)(.+)Task$/i;

/**
 * Gets the display name for a task from the class "(envi or idl)mytasknametask"
 */
function GetTaskDisplayName(name: string) {
  return TASK_NAME_REGEX.exec(
    name in CUSTOM_TYPE_DISPLAY_NAMES ? CUSTOM_TYPE_DISPLAY_NAMES[name] : name
  )[1];
}

/**
 * Does some internal magic to make sure that types for ENVI and IDL tasks
 * are normalized and easy to read.
 *
 * The basic logic is:
 * 1. For ENVI or IDL task, set the name of the type as the structure definition name
 *    which is something like "envibuildmosaicrastertask"
 * 2. Set the display name as a more readable string of the form "ENVITask<BuildMosaicRaster>"
 * 3. Removes any task names besides the first to enforce our syntax for tasks
 *
 * In this process, it also sets the display name for the type of task and uses known tasks to
 * correct the case to match our display names.
 */
export function PostProcessTypeName(type: IDLDataType) {
  for (let i = 0; i < type.length; i++) {
    // get our type
    const iType = type[i];

    // check what types we have to process
    switch (iType.name) {
      // ENVI task
      case IDL_TYPE_LOOKUP.ENVI_TASK: {
        const arg = iType.args[0][0];
        if (arg.name === IDL_TYPE_LOOKUP.ANY) {
          iType.name = `envitask`;
        } else {
          iType.name = `envi${arg.name.toLowerCase()}task`;

          // check if we have a known task and there's a display name we should match
          if (iType.name in CUSTOM_TYPE_DISPLAY_NAMES) {
            arg.display = GetTaskDisplayName(iType.name);
            arg.name = arg.display;
          }
        }

        // strip other args to force our formatting style
        iType.args[0] = [arg];
        break;
      }

      // IDL task
      case IDL_TYPE_LOOKUP.IDL_TASK: {
        const arg = iType.args[0][0];
        if (arg.name === IDL_TYPE_LOOKUP.ANY) {
          iType.name = `idltask`;
        } else {
          iType.name = `idl${arg.name.toLowerCase()}task`;

          // check if we have a known task and there's a display name we should match
          if (iType.name in CUSTOM_TYPE_DISPLAY_NAMES) {
            arg.display = GetTaskDisplayName(iType.name);
            arg.name = arg.display;
          }
        }

        // strip other args to force our formatting style
        iType.args[0] = [arg];
        break;
      }
      default:
        break;
    }
  }
}
