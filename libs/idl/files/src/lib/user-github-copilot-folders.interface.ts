import { homedir } from 'os';
import { join } from 'path';

import { VSCODE_DOT_IDL_FOLDER } from './dot-idl-folder.interface';

/**
 * User folder for GitHub copilot
 */
export const USER_COPILOT_FOLDER = join(
  VSCODE_DOT_IDL_FOLDER,
  'github-copilot'
);

/**
 * User folder for GitHub copilot instructions
 */
export const USER_COPILOT_INSTRUCTIONS_FOLDER = join(
  USER_COPILOT_FOLDER,
  'instructions'
);

/**
 * User folder for GitHub copilot prompts
 */
export const USER_COPILOT_PROMPTS_FOLDER = join(USER_COPILOT_FOLDER, 'prompts');

/**
 * Returns home-relative path for a given absolute path
 */
function toHomeRelative(absolutePath: string): string {
  return absolutePath.replace(homedir(), '~').replace(/\\/g, '/');
}

/**
 * Home-relative path for GitHub copilot folder
 */
export const USER_COPILOT_FOLDER_HOME_RELATIVE =
  toHomeRelative(USER_COPILOT_FOLDER);

/**
 * Home-relative path for GitHub copilot instructions
 */
export const USER_COPILOT_INSTRUCTIONS_FOLDER_HOME_RELATIVE = toHomeRelative(
  USER_COPILOT_INSTRUCTIONS_FOLDER
);

/**
 * Home-relative path for GitHub copilot prompts
 */
export const USER_COPILOT_PROMPTS_FOLDER_HOME_RELATIVE = toHomeRelative(
  USER_COPILOT_PROMPTS_FOLDER
);
