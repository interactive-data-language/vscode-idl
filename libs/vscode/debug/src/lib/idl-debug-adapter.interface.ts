import { IDLEvaluateOptions, IStartIDLConfig } from '@idl/idl';
import { LANGUAGE_NAME } from '@idl/shared';
import { IDL_TRANSLATION } from '@idl/translation';
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
  extends DebugProtocol.LaunchRequestArguments,
    IStartIDLConfig {
  /** Type of debug adapter we are launching ("idl") */
  type: string;
  /**  */
  name: string;
  /** Type of request ("launch") */
  request: string;
  /** Workspace folders that are open */
  folders: string[];
}

/**
 * Default configuration for debugging IDL
 */
export const DEFAULT_IDL_DEBUG_CONFIGURATION: IDLDebugConfiguration = {
  type: LANGUAGE_NAME,
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
}

/**
 * Default options when executing an IDL command
 */
export const DEFAULT_EVALUATE_OPTIONS: IDebugEvaluateOptions = {
  continued: false,
  echo: false,
  silent: false,
  idlInfo: true,
};
