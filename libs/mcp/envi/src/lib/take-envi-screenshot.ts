import {
  IIDLExecutionBackend,
  MCPProgressCallback,
} from '@idl/mcp/idl-machine';
import { IDL_TRANSLATION } from '@idl/translation';
import {
  MCPTool_TakeENVIScreenshot,
  MCPToolParams,
  MCPToolResponse,
} from '@idl/types/mcp';

/**
 * Core logic for taking a screenshot of the ENVI display.
 *
 * Independent of VS Code — works with any `IIDLExecutionBackend`.
 *
 * @TODO Implement the actual IDL/ENVI screenshot logic. The screenshot
 * should be saved to a PNG file and returned as a base64-encoded string
 * so that LLMs can consume it directly.
 */
export async function TakeENVIScreenshot(
  backend: IIDLExecutionBackend,
  params: MCPToolParams<MCPTool_TakeENVIScreenshot>,
  onProgress?: MCPProgressCallback,
): Promise<MCPToolResponse<MCPTool_TakeENVIScreenshot>> {
  onProgress?.('Starting IDL');

  const started = await backend.start(false);
  if (!started.started) {
    return {
      success: false,
      result: {
        err: started?.reason || 'Failed to start',
      },
    };
  }

  if (!backend.verifyIDLVersion()) {
    return {
      success: false,
      result: { err: IDL_TRANSLATION.mcp.errors.badIDLVersion },
    };
  }

  onProgress?.('Taking screenshot');

  /**
   * Taking screenshot will fail when UI isn't present
   *
   * We don't need to check it
   */
  return await backend.evaluateENVICommand<MCPTool_TakeENVIScreenshot>(
    `vscode_TakeENVIScreenshot`,
  );
}
