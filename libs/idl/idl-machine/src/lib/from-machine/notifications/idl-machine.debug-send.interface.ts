/**
 * Notification with debug information about IDL
 */
export type DebugSendNotification = 'debugSend';

type VariableChanges = 'self' | 'child' | 'redo child';

interface IVariable {
  /** Scope level */
  level: number;
  /** Variable name */
  name: string;
  /** IDL data type */
  type: number;
  /** Is it a scalar? */
  scalar: boolean;
  /** Dimensions */
  dims: number[];
  index: number;
  param: boolean;
  heap: boolean;
  common: boolean;
  readOnly: boolean;
  settable: boolean;
  changes: VariableChanges;
  /** String representation of the value of the variable */
  value: string;
  /** Child variables */
  children: IVariable[];
}

interface IFrame {
  /** Scope level */
  level: number;
  /** File routine is in */
  file: string;
  /** ??????? */
  name: string;
  /** Line, one based */
  line: number;
  changes: VariableChanges;
  /** Variables in the frame */
  variables: IVariable[];
}

/** Parameters for when we get debug information from IDL */
export type DebugSendParams = {
  stack: {
    /** Were there changes in the stack? */
    changes: boolean;
    /** Frames */
    frames: IFrame[];
  };
  system: IVariable[];
};
