import { homedir } from 'os';
import { join } from 'path';

/**
 * The .idl folder for IDL and VSCode
 */
export const DOT_IDL_FOLDER = join(homedir(), '.idl', 'vscode');
