import { FromIDLMachineRequestHandler } from '@idl/types/idl/idl-machine';
import {
  IDLEvaluateOptions,
  IDLSyntaxErrorLookup,
} from '@idl/types/idl/idl-process';
import { IDLVersionInfo, IIDLStartResult } from '@idl/types/vscode-debug';

import { IPrepareIDLCodeResult } from './execute-idl-code.interface';
import { MCPToolParams, MCPToolResponse } from './mcp-tools.interface';
import { MCPTools_VSCode } from './mcp-tools-vscode.interface';

/**
 * Callback to send progress notifications during MCP tool execution
 */
export type MCPProgressCallback = (message: string) => void;

/**
 * Abstraction over an IDL execution environment.
 *
 * Both the VS Code debug adapter path and the standalone
 * `IDLMCPExecutionManager` path implement this interface so that
 * MCP tool logic can be written once and run in either context.
 */
export interface IIDLMCPExecutionBackend {
  /**
   * Evaluate an IDL command and return the string output.
   */
  evaluate(command: string, options?: IDLEvaluateOptions): Promise<string>;

  /**
   * Evaluate an ENVI command and return the combined IDL output + ENVI status.
   *
   * Implementations are responsible for reading the ENVI success/failure
   * notification state after running the command.
   */
  evaluateENVICommand<T extends MCPTools_VSCode>(
    command: string,
    options?: IDLEvaluateOptions,
  ): Promise<MCPToolResponse<T>>;

  /**
   * Returns syntax errors tracked by file after the last evaluation.
   */
  getErrorsByFile(): IDLSyntaxErrorLookup;

  /**
   * Version information about the running IDL session, if available.
   */
  idlVersion: IDLVersionInfo | undefined;

  /**
   * Returns true if the IDL interpreter is back at the main level
   * (i.e. not stopped inside a routine or breakpoint).
   */
  isAtMain(): boolean;

  /**
   * Returns true if IDL is currently running.
   */
  isStarted(): boolean;

  /**
   * Prepares code for processing
   */
  prepareCode(code: string): Promise<IPrepareIDLCodeResult | undefined>;

  /**
   * Register a handler for IDL Notify events (e.g. `envi_success`).
   */
  registerIDLNotifyHandler(
    event: string,
    handler: FromIDLMachineRequestHandler<'idlNotify'>,
  ): void;

  /**
   * Reset information about the call stack.
   */
  resetCallStack(): Promise<void>;

  /**
   * Clear tracked syntax errors.
   */
  resetErrorsByFile(): void;

  /**
   * Reset the main-level program so a new execution can begin cleanly.
   */
  resetMain(): Promise<void>;

  /**
   * Runs an MCP tool and returns the proper response
   *
   * Available tools may be limited based on runtime
   */
  runMCPTool<T extends MCPTools_VSCode>(
    executionId: string,
    tool: T,
    params: MCPToolParams<T>,
    onProgress?: MCPProgressCallback,
  ): Promise<MCPToolResponse<T>>;

  /**
   * Start IDL if it is not already running.
   *
   * @param show Whether to show the IDL console (VSCode-specific; ignored in standalone)
   */
  start(show?: boolean): Promise<IIDLStartResult>;

  /**
   * Stop the running IDL session.
   */
  stop(): Promise<void>;

  /**
   * Returns true if the IDL version meets the minimum requirement (>= 9.2.0).
   */
  verifyIDLVersion(): boolean;
}
