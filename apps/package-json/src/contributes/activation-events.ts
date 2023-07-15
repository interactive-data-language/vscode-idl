import {
  CONFIG_FILE_GLOB_PATTERN,
  PRO_CODE_GLOB_PATTERN,
  TASK_FILE_GLOB_PATTERN,
} from '@idl/shared';

import { IPackageJSON, IPackageNLS } from '../package.interface';

export const BASE_ACTIVATION_EVENTS: string[] = [
  // not needed per https://code.visualstudio.com/updates/v1_74#_extension-authoring
  // `onLanguage:${IDL_LANGUAGE_NAME}`,
  `workspaceContains:${PRO_CODE_GLOB_PATTERN}`,
  `workspaceContains:${CONFIG_FILE_GLOB_PATTERN}`,
  `workspaceContains:${TASK_FILE_GLOB_PATTERN}`,
];

/**
 * Adds base activation events to our package.json file
 */
export function ProcessActivationEvents(
  packageJSON: IPackageJSON,
  nls: IPackageNLS
) {
  packageJSON['activationEvents'] = BASE_ACTIVATION_EVENTS;
}
