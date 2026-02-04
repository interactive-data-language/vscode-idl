import { MCP_TOOL_LOOKUP } from '@idl/types/mcp';
import expect from 'expect';

import { RunnerFunction } from '../../../runner.interface';
import { CallMCPTool } from '../../helpers/call-mcp-tool';

/**
 * Makes sure MCP tools fail when errors run
 */
export const RunMCPENVINotInstalledErrors: RunnerFunction = async (init) => {
  // start ENVI
  expect(
    (
      await CallMCPTool(MCP_TOOL_LOOKUP.START_ENVI, {
        headless: true,
      })
    ).isError
  ).toBeTruthy();

  // list ENVI tools
  expect(
    (await CallMCPTool(MCP_TOOL_LOOKUP.LIST_ENVI_TOOLS, {})).isError
  ).toBeTruthy();

  // get tool parameters
  expect(
    (
      await CallMCPTool(MCP_TOOL_LOOKUP.GET_ENVI_TOOL_PARAMETERS, {
        taskName: 'ISODATAClassification',
      })
    ).isError
  ).toBeTruthy();

  // get tool parameters
  expect(
    (
      await CallMCPTool(MCP_TOOL_LOOKUP.RUN_ENVI_TOOL, {
        taskName: 'ISODATAClassification',
        inputParameters: {
          input_raster: 'foo',
        },
        interactive: false,
      })
    ).isError
  ).toBeTruthy();

  // list ENVI Tool workflows
  expect(
    (await CallMCPTool(MCP_TOOL_LOOKUP.LIST_ENVI_TOOL_WORKFLOWS, {})).isError
  ).toBeTruthy();

  // get ENVI Tool workflow
  expect(
    (
      await CallMCPTool(MCP_TOOL_LOOKUP.GET_ENVI_TOOL_WORKFLOW, {
        name: 'ISODATAClassification',
      })
    ).isError
  ).toBeTruthy();

  // query dataset
  expect(
    (
      await CallMCPTool(MCP_TOOL_LOOKUP.QUERY_DATASET_WITH_ENVI, {
        dataset: {
          factory: 'URLRaster',
          url: 'file',
        },
      })
    ).isError
  ).toBeTruthy();

  // query dataset
  expect(
    (
      await CallMCPTool(MCP_TOOL_LOOKUP.OPEN_DATASETS_IN_ENVI, {
        datasets: [
          {
            factory: 'URLRaster',
            url: 'file',
          },
        ],
        automaticZoom: 'all-layers',
        resetView: false,
      })
    ).isError
  ).toBeTruthy();
};
