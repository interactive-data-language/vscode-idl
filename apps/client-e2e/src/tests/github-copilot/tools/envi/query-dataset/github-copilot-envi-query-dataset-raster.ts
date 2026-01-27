import {
  MCP_TOOL_LOOKUP,
  MCPTool_ENVIQueryDataset,
  MCPToolResponse,
} from '@idl/types/mcp';
import expect from 'expect';

import { RunnerFunction } from '../../../../runner.interface';
import { CallMCPTool } from '../../../helpers/call-mcp-tool';
import { ENVITestDatasets } from '../../../helpers/envi-test-datasets.class';

/**
 * Makes sure we can query a dataset
 */
export const RunGitHubCopilotENVIQueryDataset_Raster: RunnerFunction = async (
  init
) => {
  // Call a tool
  const result = await CallMCPTool(MCP_TOOL_LOOKUP.ENVI_QUERY_DATASET, {
    dataset: ENVITestDatasets.raster(),
  });

  // make sure the tool runs
  expect(result.isError).toBeFalsy();

  // make sure the tool runs
  expect((result.content as any[])?.length).toEqual(1);

  // init variable
  let results: MCPToolResponse<MCPTool_ENVIQueryDataset>;

  // attempt to parse
  try {
    results = JSON.parse(result.content[0].text as string);
  } catch (err) {
    // do nothing
  }

  // make sure we got an answer
  expect(results).toBeTruthy();

  // remove dehydrated dataset
  for (let i = 0; i < results.info.length; i++) {
    delete results.info[i]['dataset'];
  }

  // compare
  expect(results.info).toEqual([
    {
      ncolumns: 1024,
      nrows: 1024,
      nbands: 4,
      data_type: 'uint',
      interleave: 'bsq',
      modality: 'Optical',
      spatialref: {
        rotation: 0,
        tie_point_map: [480256, 4428984],
        factory: 'StandardRasterSpatialRef',
        pixel_size: [2.8, 2.8],
        coord_sys_code: 32613,
        tie_point_pixel: [0, 0],
      },
      coord_sys_str:
        'PROJCS["WGS_1984_UTM_Zone_13N",GEOGCS["GCS_WGS_1984",DATUM["D_WGS_1984",SPHEROID["WGS_1984",6378137.0,298.257223563]],PRIMEM["Greenwich",0.0],UNIT["Degree",0.0174532925199433]],PROJECTION["Transverse_Mercator"],PARAMETER["False_Easting",500000.0],PARAMETER["False_Northing",0.0],PARAMETER["Central_Meridian",-105.0],PARAMETER["Scale_Factor",0.9996],PARAMETER["Latitude_Of_Origin",0.0],UNIT["Meter",1.0]]',
      auxiliary_spatialref: null,
      corner_coordinates: [
        [-105.23133994705151, 40.01082215205957],
        [-105.19774524227513, 40.01088434310878],
        [-105.19767074470191, 39.98505158116151],
        [-105.23125279342888, 39.98498944666137],
      ],
      center_coordinates: [-105.21450218186436, 39.99793811192603],
      'band names': ['Band 1', 'Band 2', 'Band 3', 'Band 4'],
      'sensor type': 'QuickBird',
      description: [
        'Demo QuickBird 2 data courtesy DigitalGlobe',
        'Inc.  Not for commercial use.',
      ],
      wavelength: [485, 560, 660, 830],
      'wavelength units': 'Nanometers',
      'pixel size meters [x, y]': [2.8, 2.8],
    },
  ]);
};
