/**
 * If files have more than this many lines of code, we dont compress because
 * it is just too slow
 */
export const COMPRESSION_LINE_THRESHOLD = 2000;

/**
 * Tags that we compress/decompress
 */
export const COMPRESS_THESE = ['tree', 'global'];

/**
 * How long (ms) before we remove items from our cache without
 * accessing it
 */
export const ACCESS_EXPIRATION_MS = 300000;
