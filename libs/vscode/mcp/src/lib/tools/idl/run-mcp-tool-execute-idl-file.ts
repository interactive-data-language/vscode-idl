import { CleanIDLOutput } from '@idl/idl/idl-interaction-manager';
import { IDL_COMMANDS } from '@idl/shared/extension';
import { IDL_TRANSLATION } from '@idl/translation';
import {
  MCPTool_ExecuteIDLFile,
  MCPToolParams,
  MCPToolResponse,
} from '@idl/types/mcp';
import { IRunIDLCommandResult } from '@idl/types/vscode-debug';
import { OpenFileInVSCode } from '@idl/vscode/shared';
import * as vscode from 'vscode';

import { MCP_EXECUTION_BACKEND } from '../../initialize-mcp-vscode';

/**
 * Run a file of IDL code (VS Code wrapper)
 *
 * Uses the VS Code debug adapter's "Run" command which requires
 * the file to be open in the editor. For standalone usage, see
 * `ExecuteIDLFile` in `@idl/mcp/idl`.
 */
export async function RunMCPTool_ExecuteIDLFile(
  id: string,
  params: MCPToolParams<MCPTool_ExecuteIDLFile>,
): Promise<MCPToolResponse<MCPTool_ExecuteIDLFile>> {
  const started = await MCP_EXECUTION_BACKEND.start();

  if (!started.started) {
    return { success: false, err: started.reason };
  }

  /**
   * Open in VSCode
   *
   * *MUST BE HERE* so that we re-use our "run" logic
   */
  const doc = await OpenFileInVSCode(params.uri);

  // set compile option and make sure we are at the main level
  await MCP_EXECUTION_BACKEND.evaluate(
    `compile_opt idl2 & message, /reset & retall`,
  );

  // reset main with ".run"
  await MCP_EXECUTION_BACKEND.resetMain();

  /** Run our file */
  const result: IRunIDLCommandResult = await vscode.commands.executeCommand(
    IDL_COMMANDS.DEBUG.RUN,
  );

  // return if we didnt finish
  if (!result.success) {
    return result;
  }

  /** Check output from last message to see if we had an error */
  const lastMessage = CleanIDLOutput(
    await MCP_EXECUTION_BACKEND.evaluate(`help, /last_message`, {
      silent: true,
    }),
  );

  switch (true) {
    case lastMessage !== '':
      return {
        ...result,
        success: false,
        err: `An error message was reported:\n\n  ${lastMessage}`,
      };

    case !MCP_EXECUTION_BACKEND.isAtMain():
      return {
        success: false,
        idlOutput: result.idlOutput,
        err: IDL_TRANSLATION.debugger.commandErrors.idlStopped,
      };

    default:
      return {
        success: true,
        idlOutput: result.idlOutput,
      };
  }
}
