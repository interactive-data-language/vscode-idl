import { dirname } from 'path';

/**
 * Location of IDL, ENVI, and ENVI Deep learning
 */
export const IDL_DIR = `C:\\Program Files\\NV5\\ENVI60\\IDL90`;

/**
 * Root folder for ENVI's installation
 */
export const ENVI_DIR = dirname(IDL_DIR);
