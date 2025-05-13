import { IDL_MCP_LOG } from '@idl/logger';
import { IDL_COMMANDS, Sleep } from '@idl/shared/extension';
import { IDL_TRANSLATION } from '@idl/translation';
import {
  MCPTool_ExecuteIDLFile,
  MCPToolParams,
  MCPToolResponse,
} from '@idl/types/mcp';
import { IRunIDLCommandResult } from '@idl/types/vscode-debug';
import { LANGUAGE_SERVER_MESSENGER } from '@idl/vscode/client';
import { IDL_DEBUG_ADAPTER, StartIDL } from '@idl/vscode/debug';
import { LANGUAGE_SERVER_MESSAGE_LOOKUP } from '@idl/vscode/events/messages';
import { IDL_LOGGER } from '@idl/vscode/logger';
import { OpenFileInVSCode, ReplaceDocumentContent } from '@idl/vscode/shared';
import * as vscode from 'vscode';

/**
 * Run a file of IDL code
 */
export async function RunMCPExecuteIDLFile(
  id: string,
  params: MCPToolParams<MCPTool_ExecuteIDLFile>
): Promise<MCPToolResponse<MCPTool_ExecuteIDLFile>> {
  /**
   * Start IDL
   */
  const started = await StartIDL();

  // return if unable to start IDL
  if (!started.started) {
    return { success: false, err: started.reason };
  }

  // open file
  const doc = await OpenFileInVSCode(params.uri);

  /**
   * Send message to convert code
   */
  const resp = await LANGUAGE_SERVER_MESSENGER.sendRequest(
    LANGUAGE_SERVER_MESSAGE_LOOKUP.PREPARE_IDL_CODE,
    {
      code: doc.getText(),
    }
  );

  // see if theres a problem, user should be alerted
  if (!resp) {
    IDL_LOGGER.log({
      type: 'error',
      log: IDL_MCP_LOG,
      content: [IDL_TRANSLATION.notebooks.errors.failedCodePrepare],
      alert: IDL_TRANSLATION.mcp.errors.failedCodePrepare,
    });

    return {
      success: false,
      err: IDL_TRANSLATION.mcp.errors.failedCodePrepare,
    };
  }

  // update file code to be correct
  await ReplaceDocumentContent(doc, resp.code);

  /** Run our file */
  const result: IRunIDLCommandResult = await vscode.commands.executeCommand(
    IDL_COMMANDS.DEBUG.RUN
  );

  // return if we didnt finish
  if (!result.success) {
    return result;
  }

  /**
   * Check if we ran successfully or not
   */
  if (IDL_DEBUG_ADAPTER.isAtMain()) {
    return {
      success: true,
      idlOutput: result.idlOutput,
    };
  } else {
    return {
      success: false,
      idlOutput: result.idlOutput,
      err: IDL_TRANSLATION.debugger.commandErrors.idlStopped,
    };
  }
}
