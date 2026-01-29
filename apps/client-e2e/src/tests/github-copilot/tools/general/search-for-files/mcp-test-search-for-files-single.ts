import { GetExtensionPath } from '@idl/idl/files';
import { MCP_TOOL_LOOKUP } from '@idl/types/mcp';
import expect from 'expect';

import { RunnerFunction } from '../../../../runner.interface';
import { CallMCPTool } from '../../../helpers/call-mcp-tool';

/**
 * Search for files with one extension
 */
export const RunMCPTestSearchForFiles_Single: RunnerFunction = async (init) => {
  /** IDL folder for searching */
  const basicDir = GetExtensionPath('idl/helpers');

  // Call a tool
  const basicSearch = await CallMCPTool(MCP_TOOL_LOOKUP.SEARCH_FOR_FILES, {
    folder: basicDir,
    recursive: true,
    extensions: ['.pro'],
  });

  // make sure the tool runs
  expect(basicSearch.isError).toBeFalsy();

  // verify we get one block of content back
  expect(basicSearch.content.length).toEqual(1);

  // init variable
  let basicSearchFiles: string[];

  // attempt to parse
  try {
    basicSearchFiles = JSON.parse(basicSearch.content[0].text as string).map(
      (file) => file.replace(basicDir, '')
    );
  } catch (err) {
    // do nothing
  }

  // make sure we parsed
  expect(basicSearchFiles).toBeTruthy();

  // make sure no matches since no queries
  expect(basicSearchFiles.length).toBeGreaterThanOrEqual(1);

  // verify multiple file extensions
  const extensions = new Set(
    basicSearchFiles
      .filter((file) => file.includes('.'))
      .map((file) => file.split('.').pop())
  );
  expect(extensions.size).toEqual(1);
};
