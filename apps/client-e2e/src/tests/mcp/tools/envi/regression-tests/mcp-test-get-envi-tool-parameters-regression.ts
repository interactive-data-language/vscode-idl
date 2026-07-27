import { GetExtensionPath } from '@idl/idl/files';
import { MCP_TOOL_LOOKUP } from '@idl/types/mcp';
import expect from 'expect';
import { mkdirSync, readdirSync, unlinkSync, writeFileSync } from 'fs';
import { join } from 'path';

import { RunnerFunction } from '../../../../runner.interface';
import { CallMCPTool } from '../../../helpers/call-mcp-tool';
import { SplitDescription } from '../../../helpers/split-description';
import { LogWhenExpectSuccess } from '../../../helpers/test-loggers';
import { REGRESSION_TEST_THESE } from './regression-test-these.interface';

/**
 * Makes regression tests for getting parameters for an ENVI tool
 */
export const RunMCPTestGetENVIToolParametersRegression: RunnerFunction = async (
  init,
) => {
  /** Get root MCP dir that should always exist */
  const rootDir = join(
    GetExtensionPath('idl/test/client-e2e/mcp'),
    'regression',
  );

  const toolParametersDir = join(rootDir, 'tool-parameters');

  // re-create folder
  mkdirSync(toolParametersDir, { recursive: true });

  // dir for input parameters
  const inputDir = join(toolParametersDir, 'inputParameters');

  // dir for output parameters
  const outputDir = join(toolParametersDir, 'outputParameters');

  // dir for notes
  const notesDir = join(toolParametersDir, 'notes');

  // ensure all folders exist, then clear any existing files so removed
  // tools don't persist between runs
  for (const dir of [inputDir, outputDir, notesDir]) {
    mkdirSync(dir, { recursive: true });
    for (const file of readdirSync(dir)) {
      unlinkSync(join(dir, file));
    }
  }

  // add regression tests
  for (let i = 0; i < REGRESSION_TEST_THESE.length; i++) {
    const toolName = REGRESSION_TEST_THESE[i];
    console.log(`  Checking tool ${toolName}`);

    // Call a tool
    const result = await CallMCPTool(MCP_TOOL_LOOKUP.GET_ENVI_TOOL_PARAMETERS, {
      toolName,
    });

    // log if we fail
    LogWhenExpectSuccess(result);

    // make sure the tool runs
    expect(result.isError).toBeFalsy();

    /** Extract content, replace gets rid of invalid JSON */
    const content = result.content
      .filter((item) => item.type === 'text')
      .map((item) =>
        JSON.parse((item.text as string).replace(/^Additional notes: /, '')),
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
      JSON.stringify(content[0], undefined, 2),
    );

    // write output parameters
    writeFileSync(
      join(outputDir, `${toolName}.json`),
      JSON.stringify(content[1], undefined, 2),
    );

    // write notes to disk
    writeFileSync(
      join(notesDir, `${toolName}.json`),
      JSON.stringify(content[2] || [], undefined, 2),
    );
  }
};
