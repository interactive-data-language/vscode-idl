import { GetExtensionPath } from '@idl/idl/files';
import { MCP_TOOL_LOOKUP } from '@idl/types/mcp';
import expect from 'expect';

import { RunnerFunction } from '../../../../runner.interface';
import { CallMCPTool } from '../../../helpers/call-mcp-tool';

/**
 * Tests for the search for files MCP tool that fails with an invalid folder
 */
export const RunMCPTestSearchForFiles_FailRight: RunnerFunction = async (
  init
) => {
  /** IDL folder for searching */
  const basicDir = GetExtensionPath('idl/helpers');

  // Call a tool
  const basicSearch = await CallMCPTool(MCP_TOOL_LOOKUP.SEARCH_FOR_FILES, {
    folder: `${basicDir}/your-father-smells-of-elderberries`,
    recursive: true,
  });

  // make sure the tool runs
  expect(basicSearch.isError).toBeTruthy();
};
