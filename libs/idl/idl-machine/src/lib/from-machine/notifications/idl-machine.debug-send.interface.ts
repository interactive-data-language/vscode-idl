/**
 * Notification with debug information about IDL
 */
export type DebugSendNotification = 'debugSend';

type VariableChanges = 'child' | 'redo child' | 'self';

interface IDLVariable {
  changes: VariableChanges;
  /** Child variables */
  children: IDLVariable[];
  common: boolean;
  /** Dimensions */
  dims: number[];
  heap: boolean;
  index: number;
  /** Scope level */
  level: number;
  /** Variable name */
  name: string;
  param: boolean;
  readOnly: boolean;
  /** Is it a scalar? */
  scalar: boolean;
  settable: boolean;
  /** IDL data type */
  type: number;
  /** String representation of the value of the variable */
  value: string;
}

export interface IDLFrame {
  changes: VariableChanges;
  /** File routine is in */
  file: string;
  /** Scope level */
  level: number;
  /** Line, one based */
  line: number;
  /** ??????? */
  name: string;
  /** Variables in the frame */
  variables: IDLVariable[];
}

/** Parameters for when we get debug information from IDL */
export type DebugSendParams = {
  stack: {
    /** Were there changes in the stack? */
    changed: boolean;
    /** Frames, current is the last one (oppostire of VSCode) */
    frames?: IDLFrame[];
  };
  system: IDLVariable[];
};
