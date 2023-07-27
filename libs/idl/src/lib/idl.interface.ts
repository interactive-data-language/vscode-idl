import { IDLExtensionConfig } from '@idl/vscode/extension-config';

/**
 * Default number of prompts we are looking for
 */
export const DEFAULT_PROMPT_LIMIT = 1;

/**
 * Config to start IDL
 */
export interface IStartIDLConfig {
  /** Extension config */
  config: IDLExtensionConfig;
  /** Environment variables */
  env: NodeJS.ProcessEnv;
  /** optionally specify the directory that IDL starts in */
  cwd?: string;
}

/**
 * Breakpoint data as it comes back from IDL
 *
 * Source: vscode_getBreakpoints
 */
export interface IRawBreakpoint {
  /** index of the breakpoint */
  i: number;
  /** Line number */
  l: number;
  /** Attributes for the breakpoints */
  a: string;
  /** File */
  f: string;
}

/**
 * Breakpoints we share with VSCode, nicely formatted
 */
export interface IDLBreakpoint {
  /** Line number for breakpoint */
  line: number;
  /** File for breakpoint */
  path: string;
  /** Name of the breakpoint */
  name?: string;
  /** ID of the breakpoint */
  id?: string;
}

/**
 * Call stack information for IDL
 */
export interface IDLCallStack {
  /** Call stack */
  frames: IDLCallStackItem[];
  /** Number of frames */
  count: number;
}

/**
 * Entry for a call stack routine
 */
export interface IDLCallStackItem {
  /** Index of our call stack */
  index: number;
  /** Routine name */
  name: string;
  /** File we are in */
  file: string;
  /** Line number */
  line: number;
}

/**
 * Callback/scope information
 */
export interface IDLScopeItem {
  /** Routine name */
  routine: string;
  /** File we are in */
  file: string;
  /** Line number */
  line: number;
}

/**
 * Data structure that we use for capturing IDL variables
 */
export interface IDLVariable {
  /** Name of the variable */
  name: string;
  /** Type of the variable */
  type: string;
  /** Description or other information about the variable */
  description: string | number;
}

/**
 * Information about the current IDl session.
 *
 * Unless turned off, retrieved after any user-driven action completes.
 */
export interface IDLInfo {
  /** Flag if we have IDL information or not */
  hasInfo: boolean;
  /** Call stack */
  scope: IDLScopeItem[];
  /** Variables in our current scope */
  variables: IDLVariable[];
  /** If ENVI has started or not */
  envi: boolean;
}

/**
 * Default information about our IDL session
 */
export const DEFAULT_IDL_INFO: IDLInfo = {
  hasInfo: false,
  scope: [],
  variables: [],
  envi: false,
};

/**
 * Options for when we run something in IDL
 */
export interface IDLEvaluateOptions {
  /**
   * Not used, but present in case we are executing a command in a
   * specific IDL scope
   */
  frameId?: number;
  /** If set, don't echo content from IDL to the debug console */
  silent?: boolean;
  /**
   * When set, indicates that we should echo output to the debug console the
   * same style as commands manually entered
   */
  echo?: boolean;
  /**
   * When we have something to echo, if this is set, it is echoed instead of
   * the command.
   */
  echoThis?: string;
  /** Retrieve information about the IDL session */
  idlInfo?: boolean;
  /**
   * When specified, the command being executed jumps to the front of the pending queue
   */
  cut?: boolean;
}

/**
 * Default options for evaluating an expression in IDL
 */
export const DEFAULT_IDL_EVALUATE_OPTIONS: IDLEvaluateOptions = {
  silent: false,
  idlInfo: true,
};

/** Stop because we encounter a breakpoint */
export type BreakpointStop = 'breakpoint';

/** Stop because of error */
export type ErrorStop = 'error';

/** Stop because we stepped */
export type StepStop = 'step';

/** Stop because we hit a "stop" in the code */
export type StopStop = 'stop';

/**
 * Reasons why the IDL interpreter might stop
 */
export type StopReason = BreakpointStop | ErrorStop | StepStop | StopStop;

/**
 * Strictly typed for constant lookup of stop reasons
 */
interface IDLStopLookup {
  /** Stop because we encounter a breakpoint */
  BREAKPOINT: BreakpointStop;
  /** Stop because of error */
  ERROR: ErrorStop;
  /** Stop because we stepped */
  STEP: StepStop;
  /** Stop because we hit a "stop" in the code */
  STOP: StopStop;
}

/**
 * Reasons why IDL might stop
 */
export const IDL_STOPS: IDLStopLookup = {
  BREAKPOINT: 'breakpoint',
  ERROR: 'error',
  STEP: 'step',
  STOP: 'stop',
};

/**
 * Data structure for a syntax error that we get from IDL's output
 */
export interface ISyntaxError {
  file: string;
  /**
   * ONE BASED line for where syntax error happens
   */
  line: number;
}
