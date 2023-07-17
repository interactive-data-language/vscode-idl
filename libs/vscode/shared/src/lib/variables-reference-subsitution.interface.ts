import { homedir } from 'os';
import { join } from 'path';

/**
 * The .idl folder for IDL and VSCode
 */
export const DOT_IDL_FOLDER = join(homedir(), '.idl', 'vscode');

/**
 * The variables that we allow substitution for
 */
export const VARIABLES_REFERENCE_REGEX = {
  /**
   * The user's .idl folder in their home directory
   */
  DOT_IDL: /\${\.idl}/im,
  /**
   * User's home folder
   */
  USER_HOME: /\${userHome}/im,
  /**
   * The workspace folder
   */
  WORKSPACE: /\${workspaceFolder}/im,
};
