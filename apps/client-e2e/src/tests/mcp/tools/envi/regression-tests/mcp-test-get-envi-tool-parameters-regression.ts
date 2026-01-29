import { GetExtensionPath } from '@idl/idl/files';
import { MCP_TOOL_LOOKUP } from '@idl/types/mcp';
import expect from 'expect';
import { existsSync, mkdirSync, rmSync, writeFileSync } from 'fs';
import { join } from 'path';

import { RunnerFunction } from '../../../../runner.interface';
import { CallMCPTool } from '../../../helpers/call-mcp-tool';
import { SplitDescription } from '../../../helpers/split-description';
import { REGRESSION_TEST_THESE } from './regression-test-these.interface';

/**
 * Makes regression tests for getting parameters for an ENVI tool
 */
export const RunMCPTestGetENVIToolParametersRegression: RunnerFunction = async (
  init
) => {
  const toolParametersDir = join(
    GetExtensionPath(
      'apps/client-e2e/src/tests/mcp/tools/envi/regression-tests'
    ),
    'tool-parameters'
  );

  // clean up
  if (existsSync(toolParametersDir)) {
    rmSync(toolParametersDir, { recursive: true, force: true });
  }

  // re-create folder
  mkdirSync(toolParametersDir, { recursive: true });

  // dir for input parameters
  const inputDir = join(toolParametersDir, 'inputParameters');
  mkdirSync(inputDir, { recursive: true });

  // dir for output parameters
  const outputDir = join(toolParametersDir, 'outputParameters');
  mkdirSync(outputDir, { recursive: true });

  // dir for notes
  const notesDir = join(toolParametersDir, 'notes');
  mkdirSync(notesDir, { recursive: true });

  // add regression tests
  for (let i = 0; i < REGRESSION_TEST_THESE.length; i++) {
    const toolName = REGRESSION_TEST_THESE[i];
    console.log(`  Checking tool ${toolName}`);

    // Call a tool
    const result = await CallMCPTool(MCP_TOOL_LOOKUP.GET_ENVI_TOOL_PARAMETERS, {
      taskName: toolName,
    });

    // make sure the tool runs
    expect(result.isError).toBeFalsy();

    /** Extract content, replace gets rid of invalid JSON */
    const content = result.content.map((item) =>
      JSON.parse((item.text as string).replace(/^Additional notes: /, ''))
    );

    // make sure the tool runs
    expect(content?.length).toBeGreaterThanOrEqual(2);

    // make descriptions easier to read
    SplitDescription(content[0]);
    SplitDescription(content[1]);

    // remove schema keys so we dont have errors about
    // description being an array instead of a scalar string
    delete content[0]['$schema'];
    delete content[1]['$schema'];

    // write input parameters to disk
    writeFileSync(
      join(inputDir, `${toolName}.json`),
      JSON.stringify(content[0], undefined, 2)
    );

    // write output parameters
    writeFileSync(
      join(outputDir, `${toolName}.json`),
      JSON.stringify(content[1], undefined, 2)
    );

    // write notes to disk
    writeFileSync(
      join(notesDir, `${toolName}.json`),
      JSON.stringify(content[2] || [], undefined, 2)
    );
  }
};
