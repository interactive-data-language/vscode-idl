import { GetExtensionPath } from '@idl/idl/files';
import { MCP_TOOL_LOOKUP } from '@idl/types/mcp';
import expect from 'expect';
import { dirname, sep } from 'path';

import { RunnerFunction } from '../../../../runner.interface';
import { CallMCPTool } from '../../../helpers/call-mcp-tool';

/**
 * Search for files with one extension
 */
export const RunMCPTestSearchForFiles_RecursionAll: RunnerFunction = async (
  init
) => {
  /** IDL folder for searching */
  const basicDir = GetExtensionPath('idl/vscode');

  // Call a tool
  const basicSearch = await CallMCPTool(MCP_TOOL_LOOKUP.SEARCH_FOR_FILES, {
    folder: basicDir,
    recursive: true,
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
      (file) => dirname(file.replace(basicDir + sep, ''))
    );
  } catch (err) {
    // do nothing
  }

  // make sure we parsed
  expect(basicSearchFiles).toBeTruthy();

  // make sure no matches since no queries
  expect(basicSearchFiles.length).toBeGreaterThanOrEqual(5);

  // verify multiple file extensions
  const extensions = new Set(basicSearchFiles);
  expect(extensions.size).toBeGreaterThan(1);
};
