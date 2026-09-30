import { MCP_TOOL_LOOKUP } from '@idl/types/mcp';
import expect from 'expect';
import { existsSync, rmSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';

import { RunnerFunction } from '../../../../runner.interface';
import { CallMCPTool } from '../../../helpers/call-mcp-tool';
import { GetTextContent } from '../../../helpers/get-text-content';

/**
 * Verifies we can create a folder through MCP
 */
export const RunMCPTestCreateFolder: RunnerFunction = async () => {
  const targetFolder = join(tmpdir(), `mcp-test-folder-${Date.now()}`);

  try {
    // Try to create the folder first time
    const result = await CallMCPTool(MCP_TOOL_LOOKUP.CREATE_FOLDER, {
      folder: targetFolder,
    });

    // Expecting success
    expect(result.isError).toBeFalsy();
    expect(existsSync(targetFolder)).toBeTruthy();

    // Try to create it again (should error since it exists now)
    const secondResult = await CallMCPTool(MCP_TOOL_LOOKUP.CREATE_FOLDER, {
      folder: targetFolder,
    });

    // Expecting error
    expect(secondResult.isError).toBeFalsy();
    expect(GetTextContent(secondResult.content)).toContain(
      'Folder already exists',
    );
  } finally {
    // Clean up temporary workspace
    if (existsSync(targetFolder)) {
      rmSync(targetFolder, { recursive: true, force: true });
    }
  }
};
