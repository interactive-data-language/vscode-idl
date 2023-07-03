import { dirname } from 'path';

/**
 * Location of IDL, ENVI, and ENVI Deep learning
 */
export const IDL_DIR = `C:\\Program Files\\Harris\\ENVI57\\IDL89`;

/**
 * Root folder for ENVI's installation
 */
export const ENVI_DIR = dirname(IDL_DIR);
