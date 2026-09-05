import { Sleep } from '@idl/shared/extension';
import { MCP_TOOL_LOOKUP } from '@idl/types/mcp';
import expect from 'expect';
import { unlinkSync, writeFileSync } from 'fs';

import {
  USER_TOOL_WORKFLOW,
  USER_TOOL_WORKFLOW_FS,
} from '../../../../test-setup.interface';
import { RunnerFunction } from '../../../runner.interface';
import { CallMCPTool } from '../../helpers/call-mcp-tool';
import { GetTextContent } from '../../helpers/get-text-content';

async function HasENVITool(name: string) {
  // Call a tool
  const result = await CallMCPTool(
    MCP_TOOL_LOOKUP.LIST_ENVI_TOOL_WORKFLOWS,
    {},
  );

  if (result.isError) {
    throw new Error('Problem retrieving tool list');
  }

  // init variable
  let toolsList!: string[];

  // attempt to parse
  try {
    toolsList = JSON.parse(GetTextContent(result.content));
  } catch (err) {
    // do nothing
  }

  if (!toolsList) {
    throw new Error('Problem parsing tool list');
  }

  if (!Array.isArray(toolsList)) {
    throw new Error('Problem parsing tool list (not array)');
  }

  return toolsList.includes(USER_TOOL_WORKFLOW);
}

/**
 * Makes sure we can list ENVI Tool Workflows
 */
export const RunMCPTestListENVIToolWorkflows: RunnerFunction = async (init) => {
  // make sure we don't know about our tool
  expect(await HasENVITool(USER_TOOL_WORKFLOW)).toBeFalsy();

  // write to disk
  writeFileSync(USER_TOOL_WORKFLOW_FS, 'Test content for test workflow');

  // wait a beat
  await Sleep(500);

  // make sure we know about our tool
  expect(await HasENVITool(USER_TOOL_WORKFLOW)).toBeTruthy();

  // delete
  unlinkSync(USER_TOOL_WORKFLOW_FS);

  // wait a beat
  await Sleep(500);

  // make sure we know about our tool
  expect(await HasENVITool(USER_TOOL_WORKFLOW)).toBeFalsy();
};
