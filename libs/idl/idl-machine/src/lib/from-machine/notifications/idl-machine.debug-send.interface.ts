/**
 * Notification with debug information about IDL
 */
export type DebugSendNotification = 'debugSend';

type VariableChanges = 'child' | 'redo child' | 'self';

interface IVariable {
  changes: VariableChanges;
  /** Child variables */
  children: IVariable[];
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

interface IFrame {
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
