import { join } from 'path';

import { DOT_IDL_FOLDER } from './dot-idl-folder.interface';

/**
 * Folder for MCP in the .idl directory
 */
export const MCP_FOLDER = join(DOT_IDL_FOLDER, 'mcp');

/**
 * Folder that contains IDL code that we run through MCP
 */
export const MCP_IDL_FOLDER = join(MCP_FOLDER, 'execute-idl-code');
