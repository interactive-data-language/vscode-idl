import { GetExtensionPath } from '@idl/idl/files';
import { MCP_TOOL_LOOKUP } from '@idl/types/mcp';
import expect from 'expect';
import { existsSync, unlinkSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';

import { CompareNotebookJSONCells } from '../../../notebooks/helpers/compare-notebook-json-cells';
import { RunnerFunction } from '../../../runner.interface';
import { CallMCPTool } from '../../helpers/call-mcp-tool';

/**
 * Makes sure we can start IDL through MCP
 */
export const RunMCPTestCreateIDLNotebook: RunnerFunction = async (init) => {
  /** Notebook file to write */
  const nbUri = join(tmpdir(), 'test-notebook1.idlnb');

  // delete if it exists
  if (existsSync(nbUri)) {
    unlinkSync(nbUri);
  }

  /**
   * Run code that completes
   */
  const result = await CallMCPTool(MCP_TOOL_LOOKUP.CREATE_IDL_NOTEBOOK, {
    uri: nbUri,
    cells: [
      {
        type: 'markdown',
        content: 'Hello world!',
      },
      {
        type: 'code',
        content: `print, 42`,
      },
    ],
  });

  // make sure the tool runs
  expect(result.isError).toBeFalsy();

  // make sure file exists
  expect(existsSync(nbUri)).toBeTruthy();

  // compare output notebooks
  await CompareNotebookJSONCells(
    GetExtensionPath(
      'idl/test/client-e2e/copilot/mcp/idl-create-notebook.idlnb'
    ),
    nbUri
  );
};
