import { dirname } from 'path';

/**
 * Location of IDL, ENVI, and ENVI Deep learning
 */
export const IDL_DIR = `C:\\Program Files\\NV5\\ENVI61\\IDL91`;

/**
 * Root folder for ENVI's installation
 */
export const ENVI_DIR = dirname(IDL_DIR);
