/**
 * Codes for problems that prevent the agents server from starting
 */
export type ConfigProblemCode =
  | 'IDL_DIRECTORY_INVALID'
  | 'IDL_NOT_FOUND'
  | 'LLM_NOT_CONFIGURED';

/**
 * A single problem found when validating the agents server config
 */
export interface IConfigProblem {
  /** Stable identifier so hosts can react without parsing the message */
  code: ConfigProblemCode;
  /** Human-readable description of the problem */
  message: string;
}
