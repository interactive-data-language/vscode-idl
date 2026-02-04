import { FindFiles, GetExtensionPath } from '@idl/idl/files';
import { MCP_TOOL_LOOKUP } from '@idl/types/mcp';
import expect from 'expect';

import { RunnerFunction } from '../../../runner.interface';
import { CallMCPTool } from '../../helpers/call-mcp-tool';
import { LogWhenExpectSuccess } from '../../helpers/test-loggers';

/**
 * Makes sure we can run an ENVI Tool with arrays of ENVI Rasters
 */
export const RunMCPTestENVIRasterArray: RunnerFunction = async (init) => {
  /** Folder with sample data */
  const dataDir = GetExtensionPath('idl/test/client-e2e/mcp/raster-array');

  // find files and map to rasters
  const rasters = (await FindFiles(dataDir, '**/*.dat')).map((file) => {
    return {
      factory: 'URLRaster',
      url: file,
    };
  });

  // make sure we found rasters
  expect(rasters.length).toBeGreaterThan(0);

  // Call a tool
  const result = await CallMCPTool(MCP_TOOL_LOOKUP.RUN_ENVI_TOOL, {
    taskName: 'BuildMosaicRaster',
    inputParameters: {
      input_rasters: rasters,
      output_raster_uri: '!',
    },
    interactive: false,
  });

  // log
  LogWhenExpectSuccess(result);

  // make sure the tool runs
  expect(result.isError).toBeFalsy();
};
