import { DOT_IDL_FOLDER, GetFSPath } from '@idl/shared';
import { homedir } from 'os';
import * as vscode from 'vscode';

import { VARIABLES_REFERENCE_REGEX } from './variables-reference-substitution.interface';

/**
 * Helper function that replaces variables similar in syntax to
 * https://code.visualstudio.com/docs/editor/variables-reference
 * in order to generate more helpful paths.
 *
 * We don't support all, only a few which are defined in `VARIABLES_REFERENCE_REGEX`
 */
export function VariablesReferenceSubstitution(input: string) {
  switch (true) {
    /**
     * Check for `${.idl}`
     */
    case VARIABLES_REFERENCE_REGEX.DOT_IDL.test(input):
      return input.replace(VARIABLES_REFERENCE_REGEX.DOT_IDL, DOT_IDL_FOLDER);

    /**
     * Check for `${userHome}`
     */
    case VARIABLES_REFERENCE_REGEX.USER_HOME.test(input):
      return input.replace(VARIABLES_REFERENCE_REGEX.USER_HOME, homedir());

    /**
     * Check for `${workspaceFolder}`
     */
    case VARIABLES_REFERENCE_REGEX.WORKSPACE.test(input): {
      /**
       * Get workspace folder
       */
      const workspaces = vscode.workspace.workspaceFolders;

      // if we dont have folders, use .idl
      if (workspaces === undefined || workspaces?.length === 0) {
        return input.replace(
          VARIABLES_REFERENCE_REGEX.WORKSPACE,
          DOT_IDL_FOLDER
        );
      } else {
        return input.replace(
          VARIABLES_REFERENCE_REGEX.WORKSPACE,
          GetFSPath(workspaces[0].uri.toString())
        );
      }
    }
    default:
      break;
  }

  // return input if no matches
  return input;
}
