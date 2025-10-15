import { CleanPath } from '@idl/shared/extension';
import { homedir } from 'os';
import { join } from 'path';

/**
 * The .idl folder for IDL and VSCode
 */
export const DOT_IDL_FOLDER = CleanPath(join(homedir(), '.idl', 'vscode'));
