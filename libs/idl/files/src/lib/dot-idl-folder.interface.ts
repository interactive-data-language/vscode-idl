import { homedir } from 'os';
import { join } from 'path';

import { CleanPath } from './clean-path';

/**
 * The .idl folder for IDL and VSCode
 */
export const DOT_IDL_FOLDER = CleanPath(join(homedir(), '.idl', 'vscode'));
