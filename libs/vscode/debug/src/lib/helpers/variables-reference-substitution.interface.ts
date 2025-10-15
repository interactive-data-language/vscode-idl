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
