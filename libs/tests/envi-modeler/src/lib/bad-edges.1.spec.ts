import { ValidateENVIModelerNodes } from '@idl/envi/modeler';
import { LogManager } from '@idl/logger';
import { MCPTaskRegistry } from '@idl/mcp/tasks';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { GLOBAL_TOKEN_TYPES } from '@idl/types/idl-data-types';
import { ENVIModelerEdge, ENVIModelerNode } from '@idl/types/mcp';
import { DEFAULT_IDL_EXTENSION_CONFIG } from '@idl/vscode/extension-config';

IDL_INDEX_OPTIONS.IS_TEST = true;

// create log manager
const logManager = new LogManager({
  alert: () => {
    // do nothing
  },
});

// create index
const index = new IDLIndex(logManager, 1, false);

// load global tokens
index.loadGlobalTokens(DEFAULT_IDL_EXTENSION_CONFIG);

// create registry
const registry = new MCPTaskRegistry(logManager);

// populate registry
registry.registerTasksFromGlobalTokens(
  index.globalIndex.globalTokensByTypeByName[GLOBAL_TOKEN_TYPES.FUNCTION],
  index.globalIndex.globalTokensByTypeByName[GLOBAL_TOKEN_TYPES.STRUCTURE],
);

describe(`[auto generated] Bad Edges`, () => {
  it(`[auto generated] for simple cases`, () => {
    // define nodes
    const nodes: ENVIModelerNode[] = [
      {
        id: 'input_params',
        type: 'inputparameters',
        display_name: 'Input Parameters',
        parameters: [
          {
            name: 'input_raster1',
            display_name: 'First Input Raster',
            description: 'First raster for image intersection',
            type: 'ENVIRaster',
          },
          {
            name: 'input_raster2',
            display_name: 'Second Input Raster',
            description: 'Second raster for image intersection',
            type: 'ENVIRaster',
          },
        ],
      },
      {
        id: 'intersection_task',
        type: 'task',
        display_name: 'Image Intersection',
        task_name: 'ImageIntersection',
        comment: 'Finds the overlapping area between two input rasters',
      },
      {
        id: 'layerstack_task',
        type: 'task',
        display_name: 'Build Layer Stack',
        task_name: 'BuildLayerStack',
        comment:
          'Stacks the two intersection results into a single multi-band raster',
      },
      {
        id: 'output_params',
        type: 'outputparameters',
        display_name: 'Output Parameters',
      },
    ];

    // define edges
    const edges: ENVIModelerEdge[] = [
      {
        from: 'input_params12',
        from_parameters: ['input_raster1'],
        to: 'intersection_task12',
        to_parameters: ['input_raster1'],
      },
      {
        from: 'input_params',
        from_parameters: ['input_raster2'],
        to: 'intersection_task',
        to_parameters: ['input_raster2'],
      },
      {
        from: 'intersection_task',
        from_parameters: ['output_raster1', 'output_raster2'],
        to: 'layerstack_task',
        to_parameters: ['input_rasters'],
      },
      {
        from: 'layerstack_task',
        from_parameters: ['output_raster'],
        to: 'output_params',
        to_parameters: [''],
      },
    ];

    // validate nodes
    const errors = ValidateENVIModelerNodes(nodes, edges, registry);

    // define expected errors
    const expectedErrors: string[] = [
      'Edge 0 (zero-based) references unknown source node id "input_params12"',
      'Edge 0 (zero-based) references unknown target node id "intersection_task12"',
    ];

    // verify errors
    expect(errors).toEqual(expectedErrors);
  });
});
