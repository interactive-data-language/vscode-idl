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
  /** optionally specify the directory that IDL starts in */
  cwd?: string;
  /** Environment variables */
  env: { [key: string]: any };
}

/**
 * Breakpoint data as it comes back from IDL
 *
 * Source: vscode_getBreakpoints
 */
export interface IRawBreakpoint {
  /** Attributes for the breakpoints */
  a: string;
  /** File */
  f: string;
  /** index of the breakpoint */
  i: number;
  /** Line number */
  l: number;
}

/**
 * Breakpoints we share with VSCode, nicely formatted
 */
export interface IDLBreakpoint {
  /** ID of the breakpoint */
  id?: string;
  /** Line number for breakpoint */
  line: number;
  /** Name of the breakpoint */
  name?: string;
  /** File for breakpoint */
  path: string;
}

/**
 * Call stack information for IDL
 */
export interface IDLCallStack {
  /** Number of frames */
  count: number;
  /** Call stack */
  frames: IDLCallStackItem[];
}

/**
 * Entry for a call stack routine
 */
export interface IDLCallStackItem {
  /** File we are in */
  file: string;
  /** Index of our call stack */
  index: number;
  /** Line number */
  line: number;
  /** Routine name */
  name: string;
}

/**
 * Callback/scope information
 */
export interface IDLScopeItem {
  /** File we are in */
  file: string;
  /** Line number */
  line: number;
  /** Routine name */
  routine: string;
}

/**
 * Data structure that we use for capturing IDL variables
 */
export interface IDLVariable {
  /** Description or other information about the variable */
  description: number | string;
  /** Name of the variable */
  name: string;
  /** Type of the variable */
  type: string;
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
}

/**
 * Default information about our IDL session
 */
export const DEFAULT_IDL_INFO: IDLInfo = {
  hasInfo: false,
  scope: [],
  variables: [],
};

/**
 * Options for when we run something in IDL
 */
export interface IDLEvaluateOptions {
  /**
   * When specified, the command being executed jumps to the front of the pending queue
   */
  cut?: boolean;
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
  /**
   * Not used, but present in case we are executing a command in a
   * specific IDL scope
   */
  frameId?: number;
  /** Retrieve information about the IDL session */
  idlInfo?: boolean;
  /** If set, don't echo content from IDL to the debug console */
  silent?: boolean;
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
export interface IDLSyntaxError {
  file: string;
  /**
   * ONE BASED line for where syntax error happens
   */
  line: number;
}

/**
 * By file-system-path syntax errors for files
 */
export interface IDLSyntaxErrorLookup {
  [key: string]: IDLSyntaxError[];
}

/** Line of code that is not something that runs */
type IDLCodeCoverageNotCodeFlag = 0;
/** line of code that we didnt run */
type IDLCodeCoverageNotExecutedFlag = 1;
/** Line of code that we ran */
type IDLCodeCoverageExecutedFlag = 2;

/** Flag to track cover coverage */
export type IDLCodeCoverageFlag =
  | IDLCodeCoverageExecutedFlag
  | IDLCodeCoverageNotCodeFlag
  | IDLCodeCoverageNotExecutedFlag;

/**
 * Strictly typed lookup of code coverage flags
 */
interface IDLCodeCoverageLookup {
  EXECUTED: IDLCodeCoverageExecutedFlag;
  NOT_CODE: IDLCodeCoverageNotCodeFlag;
  NOT_EXECUTED: IDLCodeCoverageNotExecutedFlag;
}

/**
 * Lookup of code coverage flags
 */
export const IDL_CODE_COVERAGE_LOOKUP: IDLCodeCoverageLookup = {
  NOT_CODE: 0,
  NOT_EXECUTED: 1,
  EXECUTED: 2,
};

/**
 * Data structure for code coverage from IDL
 */
export type IDLCodeCoverage = Array<IDLCodeCoverageFlag>;

/** Progress bar percentage */
export const IDL_PROGRESS = /\r\s*[0-9]+(?:\.[0-9]+)?%/im;
