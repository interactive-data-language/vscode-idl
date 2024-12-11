/**
 * Request a line of input from IDL, triggered by the
 * "read" procedure
 */
export type ReadIOLineRequest = 'readIOLine';

/**
 * The parameters when requesting a line of input
 */
export type ReadIOLineParams = {
  prompt: string;
  size: number;
};

/**
 * The text to send back
 */
export type ReadIOLineResponse = string;
