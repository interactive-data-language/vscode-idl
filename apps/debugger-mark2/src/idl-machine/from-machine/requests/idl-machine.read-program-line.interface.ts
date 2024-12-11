/**
 * Read program line from .run
 *
 * I am marking as deprecated because people shouldnt use this
 *
 * @deprecated
 */
export type ReadProgramLineRequest = 'readProgramLine';

/**
 * No parameters for reset confirmation
 */
export type ReadProgramLineParams = {
  prompt: string;
  size: number;
};

/**
 * The code to send back
 */
export type ReadProgramLineResponse = string;
