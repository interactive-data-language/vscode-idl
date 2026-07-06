import {
  MCP_TOOL_LOOKUP,
  MCPToolResponse_SaveENVIToolWorkflow,
} from '@idl/types/mcp';
import expect from 'expect';
import { existsSync } from 'fs';

import { RunnerFunction } from '../../../runner.interface';
import { CallMCPTool } from '../../helpers/call-mcp-tool';
import { GetTextContent } from '../../helpers/get-text-content';

/** Name of the test workflow created during this test */
const TEST_WORKFLOW_NAME = 'mcp test save workflow';

/**
 * Verifies that we can save a new ENVI Tool Workflow via MCP
 */
export const RunMCPTestSaveENVIToolWorkflow: RunnerFunction = async (init) => {
  /**
   * Save a new workflow
   */
  const result = await CallMCPTool(MCP_TOOL_LOOKUP.SAVE_ENVI_TOOL_WORKFLOW, {
    workflowName: TEST_WORKFLOW_NAME,
    workflowContent:
      '## OVERVIEW\n\nTest workflow for MCP integration test.\n\n## WORKFLOW\n\n### Step 1: Test step\n\nDo something.',
  });

  // make sure the tool ran without error
  expect(result.isError).toBeFalsy();

  // parse result
  const parsed = JSON.parse(
    GetTextContent(result.content),
  ) as MCPToolResponse_SaveENVIToolWorkflow;

  // make sure a file path was returned
  expect(parsed.filePath).toBeTruthy();

  // make sure the file exists
  expect(existsSync(parsed.filePath as string)).toBeTruthy();
};

/**
 * Verifies that saving a duplicate workflow name returns an error
 */
export const RunMCPTestSaveENVIToolWorkflow_DuplicateError: RunnerFunction =
  async (init) => {
    /**
     * Attempt to save the same workflow name a second time (should fail)
     */
    const result = await CallMCPTool(MCP_TOOL_LOOKUP.SAVE_ENVI_TOOL_WORKFLOW, {
      workflowName: TEST_WORKFLOW_NAME,
      workflowContent: '## OVERVIEW\n\nDuplicate workflow.',
    });

    // the MCP call itself should succeed (isError is for transport-level errors)
    expect(result.isError).toBeTruthy();
  };
