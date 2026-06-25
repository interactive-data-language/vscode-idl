import { join } from 'path';

import { DOT_IDL_FOLDER } from './dot-idl-folder.interface';

/**
 * User folder for agents
 */
export const USER_AGENTS_FOLDER = join(DOT_IDL_FOLDER, 'agents');

/**
 * User folder for agent instructions that we manage with the extension
 */
export const USER_AGENT_INSTRUCTIONS_FOLDER = join(
  USER_AGENTS_FOLDER,
  'instructions',
);

/**
 * User folder for agent prompts that we manage with the extension
 */
export const USER_AGENT_PROMPTS_FOLDER = join(USER_AGENTS_FOLDER, 'prompts');

/**
 * User folder for custom instructions
 *
 * Not publicly exposed
 */
export const USER_CUSTOM_AGENT_INSTRUCTIONS_FOLDER = join(
  USER_AGENTS_FOLDER,
  'user-instructions',
);

/**
 * User folder for custom prompts
 *
 * Not publicly exposed
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
export const MCP_IDL_FOLDER = join(MCP_FOLDER, 'execute-idl-code');
