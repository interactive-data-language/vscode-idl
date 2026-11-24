import { homedir } from 'os';
import { join } from 'path';

import { DOT_IDL_FOLDER } from './dot-idl-folder.interface';

/**
 * User folder for agents
 */
export const USER_AGENTS_FOLDER = join(DOT_IDL_FOLDER, 'agents');

/**
 * Legacy folder for agents
 *
 * @deprecated
 */
export const OLD_USER_AGENTS_FOLDER = join(
  DOT_IDL_FOLDER,
  'vscode',
  'github-copilot',
);

/**
 * User folder for GitHub Copilot, respects COPILOT_HOME
 */
export const COPILOT_HOME_FOLDER = process.env['COPILOT_HOME']
  ? process.env['COPILOT_HOME']
  : join(homedir(), '.copilot');

/**
 * User folder for agent instructions that we manage with the extension
 *
 * This is the native location that GitHub Copilot reads from
 */
export const USER_AGENT_INSTRUCTIONS_FOLDER = join(
  COPILOT_HOME_FOLDER,
  'instructions',
);

/**
 * Legacy user folder for agent instructions that we managed
 *
 * @deprecated
 */
export const OLD_USER_AGENT_INSTRUCTIONS_FOLDER = join(
  USER_AGENTS_FOLDER,
  'instructions',
);

/**
 * Legacy user folder for agent prompts that we managed
 *
 * @deprecated Only used to clean up old settings
 */
export const USER_AGENT_PROMPTS_FOLDER = join(USER_AGENTS_FOLDER, 'prompts');

/**
 * Legacy user folder for custom instructions, contents are moved to
 * `USER_AGENT_INSTRUCTIONS_FOLDER`
 *
 * @deprecated
 */
export const OLD_USER_CUSTOM_AGENT_INSTRUCTIONS_FOLDER = join(
  USER_AGENTS_FOLDER,
  'user-instructions',
);

/**
 * Legacy user folder for custom prompts
 *
 * @deprecated Only used to clean up old settings
 */
export const USER_CUSTOM_AGENT_PROMPTS_FOLDER = join(
  USER_AGENTS_FOLDER,
  'user-prompts',
);

/**
 * Folder that contains user ENVI Tool Workflows
 */
export const USER_ENVI_WORKFLOWS_FOLDER = join(
  USER_AGENTS_FOLDER,
  'envi-tool-workflows',
);

/**
 * Folder for MCP in the .idl directory
 */
export const MCP_FOLDER = join(USER_AGENTS_FOLDER, 'mcp');

/**
 * Folder that contains IDL code that we run through MCP
 */
export const MCP_IDL_FOLDER = join(MCP_FOLDER, 'run-idl-code');
