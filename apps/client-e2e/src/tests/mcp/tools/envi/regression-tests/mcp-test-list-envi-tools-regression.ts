import { GetExtensionPath } from '@idl/idl/files';
import { MCP_TOOL_LOOKUP } from '@idl/types/mcp';
import expect from 'expect';
import { existsSync, mkdirSync, rmSync, writeFileSync } from 'fs';
import { join } from 'path';

import { RunnerFunction } from '../../../../runner.interface';
import { CallMCPTool } from '../../../helpers/call-mcp-tool';
import { REGRESSION_TEST_THESE } from './regression-test-these.interface';

/**
 * Gets a matching key, case insensitive
 */
function GetKey(name: string, obj: { [key: string]: any }) {
  const lc = name.toLowerCase();
  return Object.keys(obj).find((item) => item.toLowerCase() === lc);
}

/**
 * Makes regression tests for listing ENVI tools
 */
export const RunMCPTestListENVIToolsRegression: RunnerFunction = async (
  init,
) => {
  // Call a tool
  const result = await CallMCPTool(MCP_TOOL_LOOKUP.LIST_ENVI_TOOLS, {});

  // make sure the tool runs
  expect(result.isError).toBeFalsy();

  // make sure the tool runs
  expect((result.content as any[])?.length).toEqual(1);

  // init variable
  let toolsList: { [key: string]: string };

  // attempt to parse
  try {
    toolsList = JSON.parse(
      (result.content[0].text as string).replace(/^All tools: /, ''),
    );
  } catch (err) {
    // do nothing
  }

  const toolDescriptionDir = join(
    GetExtensionPath('idl/test/client-e2e/mcp/regression'),
    'tool-descriptions',
  );

  // clean up
  if (existsSync(toolDescriptionDir)) {
    rmSync(toolDescriptionDir, { recursive: true, force: true });
  }

  // re-create folder
  mkdirSync(toolDescriptionDir, { recursive: true });

  // add regression tests
  for (let i = 0; i < REGRESSION_TEST_THESE.length; i++) {
    const toolName = REGRESSION_TEST_THESE[i];
    console.log(`  Checking tool ${toolName}`);

    // get the key
    const key = GetKey(toolName, toolsList);

    // make sure our tool is present
    expect(key).toBeTruthy();

    // write regression test to disk
    writeFileSync(
      join(toolDescriptionDir, `${toolName}.json`),
      JSON.stringify(toolsList[key].split(/\n/g), undefined, 2),
    );
  }
};
