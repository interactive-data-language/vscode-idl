import { CleanPath } from '@idl/shared/extension';
import { homedir } from 'os';
import { join } from 'path';

/**
 * The .idl folder for IDL and VSCode
 */
export const DOT_IDL_FOLDER = CleanPath(join(homedir(), '.idl'));

/**
 * The .idl folder for IDL and VSCode
 */
export const VSCODE_DOT_IDL_FOLDER = join(DOT_IDL_FOLDER, 'vscode');

/**
 * IDL package directory
 */
export const IDL_PACKAGE_DIR = join(DOT_IDL_FOLDER, 'idl', 'packages');
