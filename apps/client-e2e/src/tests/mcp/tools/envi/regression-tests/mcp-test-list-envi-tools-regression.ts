import { GetExtensionPath } from '@idl/idl/files';
import { MCP_TOOL_LOOKUP } from '@idl/types/mcp';
import expect from 'expect';
import { existsSync, mkdirSync, rmSync, writeFileSync } from 'fs';
import { join } from 'path';

import { RunnerFunction } from '../../../../runner.interface';
import { CallMCPTool } from '../../../helpers/call-mcp-tool';
import { REGRESSION_TEST_THESE } from './regression-test-these.interface';

/**
 * Makes regression tests for listing ENVI tools
 */
export const RunMCPTestListENVIToolsRegression: RunnerFunction = async (
  init
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
    toolsList = JSON.parse(result.content[0].text as string);
  } catch (err) {
    // do nothing
  }

  const toolDescriptionDir = join(
    GetExtensionPath(
      'apps/client-e2e/src/tests/mcp/tools/envi/regression-tests'
    ),
    'tool-descriptions'
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

    // make sure our tool is present
    expect(toolName.toLowerCase() in toolsList).toBeTruthy();

    // write regression test to disk
    writeFileSync(
      join(toolDescriptionDir, `${toolName}.json`),
      JSON.stringify(
        toolsList[toolName.toLowerCase()].split(/\n/g),
        undefined,
        2
      )
    );
  }
};
