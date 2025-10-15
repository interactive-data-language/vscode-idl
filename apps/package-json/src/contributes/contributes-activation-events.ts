import { IPackageJSON, IPackageNLS } from '../package.interface';

export const BASE_ACTIVATION_EVENTS: string[] = [
  '*',
  // not needed per https://code.visualstudio.com/updates/v1_74#_extension-authoring
  // `onLanguage:${IDL_LANGUAGE_NAME}`,
  // `onLanguage:${IDL_LANGUAGE_NAME}`,
  // `onLanguage:${LOG_LANGUAGE_NAME}`,
  // `onLanguage:${IDL_NOTEBOOK_NAME}`,

  // // manual activation events, but these dont always let our extension start
  // `workspaceContains:${PRO_CODE_GLOB_PATTERN}`,
  // `workspaceContains:${PRO_DEF_GLOB_PATTERN}`,
  // `workspaceContains:${IDL_JSON_GLOB_PATTERN}`,
  // `workspaceContains:${IDL_PACKAGE_GLOB_PATTERN}`,
  // `workspaceContains:${TASK_FILE_GLOB_PATTERN}`,
  // `workspaceContains:${NOTEBOOK_GLOB_PATTERN}`,
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
