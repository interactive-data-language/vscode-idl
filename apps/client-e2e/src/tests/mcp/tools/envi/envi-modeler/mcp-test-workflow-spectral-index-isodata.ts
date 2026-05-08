import {
  ENVIModelerNode,
  MCP_TOOL_LOOKUP,
  MCPTool_CreateENVIModelerWorkflow,
} from '@idl/types/mcp';
import expect from 'expect';
import { existsSync, unlinkSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';

import { RunnerFunction } from '../../../../runner.interface';
import { CallMCPTool } from '../../../helpers/call-mcp-tool';
import { LogWhenExpectSuccess } from '../../../helpers/test-loggers';

/**
 * Test creating a spectral index + layer stack + ISODATA workflow
 */
export const RunMCPTestWorkflowSpectralIndexIsodata: RunnerFunction = async (
  _init,
) => {
  const nodes: ENVIModelerNode[] = [
    {
      id: 'inputs',
      type: 'inputparameters',
      parameters: [
        {
          name: 'raster1',
          display_name: 'Raster 1',
          description: 'First input raster for spectral index computation',
          type: 'ENVIRaster',
        },
        {
          name: 'raster2',
          display_name: 'Raster 2',
          description: 'Second input raster for spectral index computation',
          type: 'ENVIRaster',
        },
        {
          name: 'raster3',
          display_name: 'Raster 3',
          description: 'Third input raster for spectral index computation',
          type: 'ENVIRaster',
        },
      ],
    },
    {
      id: 'si1',
      type: 'task',
      task_name: 'SpectralIndex',
      static_input: {
        index: 'Normalized Difference Vegetation Index',
      },
      comment: 'Compute NDVI for Raster 1',
    },
    {
      id: 'si2',
      type: 'task',
      task_name: 'SpectralIndex',
      static_input: {
        index: 'Normalized Difference Vegetation Index',
      },
      comment: 'Compute NDVI for Raster 2',
    },
    {
      id: 'si3',
      type: 'task',
      task_name: 'SpectralIndex',
      static_input: {
        index: 'Normalized Difference Vegetation Index',
      },
      comment: 'Compute NDVI for Raster 3',
    },
    {
      id: 'layerstack',
      type: 'task',
      task_name: 'BuildLayerStack',
      comment:
        'Stack all three spectral index rasters into a single multi-band image',
    },
    {
      id: 'isodata',
      type: 'task',
      task_name: 'ISODATAClassification',
      comment: 'Unsupervised classification of the stacked spectral indices',
    },
    {
      id: 'datamanager',
      type: 'datamanager',
    },
    {
      id: 'outputs',
      type: 'outputparameters',
    },
  ];

  const edges = [
    {
      from: 'inputs',
      from_parameters: ['raster1'],
      to: 'si1',
      to_parameters: ['input_raster'],
    },
    {
      from: 'inputs',
      from_parameters: ['raster2'],
      to: 'si2',
      to_parameters: ['input_raster'],
    },
    {
      from: 'inputs',
      from_parameters: ['raster3'],
      to: 'si3',
      to_parameters: ['input_raster'],
    },
    {
      from: 'si1',
      from_parameters: ['output_raster'],
      to: 'layerstack',
      to_parameters: ['input_rasters'],
    },
    {
      from: 'si2',
      from_parameters: ['output_raster'],
      to: 'layerstack',
      to_parameters: ['input_rasters'],
    },
    {
      from: 'si3',
      from_parameters: ['output_raster'],
      to: 'layerstack',
      to_parameters: ['input_rasters'],
    },
    {
      from: 'layerstack',
      from_parameters: ['output_raster'],
      to: 'isodata',
      to_parameters: ['input_raster'],
    },
    {
      from: 'isodata',
      from_parameters: ['output_raster'],
      to: 'datamanager',
      to_parameters: [''],
    },
    {
      from: 'isodata',
      from_parameters: ['output_raster'],
      to: 'outputs',
      to_parameters: [''],
    },
  ];

  const outputPath = join(
    tmpdir(),
    `test_spectral_index_isodata_${Date.now()}.model`,
  );

  const result = await CallMCPTool<MCPTool_CreateENVIModelerWorkflow>(
    MCP_TOOL_LOOKUP.CREATE_ENVI_MODELER_WORKFLOW,
    {
      nodes,
      edges,
      output_path: outputPath,
    },
  );

  LogWhenExpectSuccess(result);
  expect(result.isError).toBeFalsy();

  // Verify output file exists
  expect(existsSync(outputPath)).toBeTruthy();

  // Clean up output file
  if (existsSync(outputPath)) {
    unlinkSync(outputPath);
  }
};
