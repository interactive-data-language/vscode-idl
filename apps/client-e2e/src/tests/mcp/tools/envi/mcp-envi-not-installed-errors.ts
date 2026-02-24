import { MCP_TOOL_LOOKUP } from '@idl/types/mcp';
import expect from 'expect';

import { RunnerFunction } from '../../../runner.interface';
import { CallMCPTool } from '../../helpers/call-mcp-tool';

/**
 * Makes sure MCP tools fail when errors run
 */
export const RunMCPENVINotInstalledErrors: RunnerFunction = async (init) => {
  // list ENVI tools
  expect(
    (await CallMCPTool(MCP_TOOL_LOOKUP.LIST_ENVI_TOOLS, {})).isError
  ).toBeTruthy();

  // get tool parameters
  expect(
    (
      await CallMCPTool(MCP_TOOL_LOOKUP.GET_ENVI_TOOL_PARAMETERS, {
        toolName: 'ISODATAClassification',
      })
    ).isError
  ).toBeTruthy();

  // get tool parameters
  expect(
    (
      await CallMCPTool(MCP_TOOL_LOOKUP.RUN_ENVI_TOOL, {
        toolName: 'ISODATAClassification',
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

  // start ENVI
  expect(
    (
      await CallMCPTool(MCP_TOOL_LOOKUP.MANAGE_IDL_AND_ENVI_SESSION, {
        action: 'start-envi',
      })
    ).isError
  ).toBeTruthy();

  // start ENVI
  expect(
    (
      await CallMCPTool(MCP_TOOL_LOOKUP.MANAGE_IDL_AND_ENVI_SESSION, {
        action: 'start-envi-headless',
      })
    ).isError
  ).toBeTruthy();

  // manage ENVI session
  expect(
    (
      await CallMCPTool(MCP_TOOL_LOOKUP.MANAGE_IDL_AND_ENVI_SESSION, {
        action: 'restart-envi',
      })
    ).isError
  ).toBeTruthy();

  // manage ENVI session
  expect(
    (
      await CallMCPTool(MCP_TOOL_LOOKUP.MANAGE_IDL_AND_ENVI_SESSION, {
        action: 'restart-envi-headless',
      })
    ).isError
  ).toBeTruthy();
};
