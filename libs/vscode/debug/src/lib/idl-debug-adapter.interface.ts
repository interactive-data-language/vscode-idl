import { IDL_LANGUAGE_NAME } from '@idl/shared/extension';
import { IDL_TRANSLATION } from '@idl/translation';
import {
  IDLEvaluateOptions,
  IStartIDLConfig,
} from '@idl/types/idl/idl-process';
import { DEFAULT_IDL_EXTENSION_CONFIG } from '@idl/vscode/extension-config';
import { DebugProtocol } from '@vscode/debugprotocol';

export interface IFileBreakpoint {
  [key: number]: boolean;
}

export interface IBreakpointLookup {
  [key: string]: IFileBreakpoint;
}

/**
 * Debug configuration for IDL
 */
export interface IDLDebugConfiguration
  extends IStartIDLConfig,
    DebugProtocol.LaunchRequestArguments {
  /** Workspace folders that are open */
  folders: string[];
  /**  */
  name: string;
  /** Type of request ("launch") */
  request: string;
  /** Type of debug adapter we are launching ("idl") */
  type: string;
}

/**
 * Default configuration for debugging IDL
 */
export const DEFAULT_IDL_DEBUG_CONFIGURATION: IDLDebugConfiguration = {
  type: IDL_LANGUAGE_NAME,
  name: IDL_TRANSLATION.debugger.idl.name,
  request: 'launch',
  env: process.env,
  config: DEFAULT_IDL_EXTENSION_CONFIG,
  folders: [],
};

/**
 * When running IDL in debug mode, options to send it a command
 * to execute
 */
export interface IDebugEvaluateOptions extends IDLEvaluateOptions {
  /**
   * When set, the debug adapter will emit a `ContinueEvent` to indicate that,
   * if we were stopped on a breakpoint or something similar, that we have moved on
   */
  continued?: boolean;
  /**
   * Do we check IDL's output for errors? Also updates decorators
   */
  errorCheck?: boolean;
  /**
   * If set, adds a new line to the output after running
   */
  newLine?: boolean;
  /**
   * If set, then we dont wait for the IDL startup promise to resolve
   *
   * ADVANCED USE CASE when we are starting IDL
   */
  noWait?: boolean;
}

/**
 * Default options when executing an IDL command
 */
export const DEFAULT_EVALUATE_OPTIONS: IDebugEvaluateOptions = {
  continued: false,
  echo: false,
  silent: false,
  idlInfo: true,
  newLine: false,
  noWait: false,
  errorCheck: false,
};

/** Log level for debug adapter method */
export const ADAPTER_METHOD_LOG_LEVEL = 'debug';

/** How long do we wait before refocusing the stack trace (ms) */
export const ADAPTER_STOP_DELAY = 100;
