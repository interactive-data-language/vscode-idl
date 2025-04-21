/**
 * Notification to execute a string
 */
export type ExecuteStringNotification = 'exec';

/** Flag to update debug model of IDL */
type UpdateDebugExecuteFlag = 0x1;

/** Don't add item to IDL's history */
type SilentExecuteFlag = 0x2;

/** Execution flags to change how IDL executes */
export type ExecuteStringFlags =
  | SilentExecuteFlag
  | (SilentExecuteFlag & UpdateDebugExecuteFlag)
  | UpdateDebugExecuteFlag;

/** Number of items to return */
export type ExecuteStringParams = {
  /** Code to execute (limit of 32k characters) */
  string: string;
  /** Flags to execute */
  flags?: ExecuteStringFlags;
};
