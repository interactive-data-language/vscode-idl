import {
  CreateENVIModelerWorkflow,
  ValidateENVIModelerWorkflow,
} from '@idl/envi/modeler';
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

describe(`[auto generated] Generic change detection workflow`, () => {
  it(`[auto generated] for the happy path`, () => {
    // define nodes
    const nodes: ENVIModelerNode[] = [
      {
        id: 'inputs',
        type: 'inputparameters',
        parameters: [
          {
            name: 'before_raster',
            display_name: 'Before Raster (Time 1)',
            description: 'Raster from the earlier time period',
            type: 'ENVIRaster',
          },
          {
            name: 'after_raster',
            display_name: 'After Raster (Time 2)',
            description: 'Raster from the later time period',
            type: 'ENVIRaster',
          },
        ],
      },
      {
        id: 'intersect',
        type: 'task',
        task_name: 'ImageIntersection',
        comment: 'Clip both images to the same spatial extent and pixel grid',
      },
      {
        id: 'sam_diff',
        type: 'task',
        task_name: 'SAMImageDifference',
        comment:
          'Compute spectral-angle difference; smaller angle = less change',
      },
      {
        id: 'outputs',
        type: 'outputparameters',
      },
    ];

    // define edges
    const edges: ENVIModelerEdge[] = [
      {
        from: 'inputs',
        from_parameters: ['before_raster'],
        to: 'intersect',
        to_parameters: ['input_raster1'],
      },
      {
        from: 'inputs',
        from_parameters: ['after_raster'],
        to: 'intersect',
        to_parameters: ['input_raster2'],
      },
      {
        from: 'intersect',
        from_parameters: ['output_raster1'],
        to: 'sam_diff',
        to_parameters: ['input_raster1'],
      },
      {
        from: 'intersect',
        from_parameters: ['output_raster2'],
        to: 'sam_diff',
        to_parameters: ['input_raster2'],
      },
      {
        from: 'sam_diff',
        from_parameters: ['output_raster'],
        to: 'outputs',
        to_parameters: [''],
      },
    ];

    // validate nodes
    const errors = ValidateENVIModelerWorkflow(nodes, edges, registry);

    // define expected errors
    const expectedErrors: string[] = [];

    // verify errors
    expect(errors).toEqual(expectedErrors);

    // define expected workflow
    const expectedWorkflow = {
      schema: 'envimodel_1.0',
      nodes: [
        {
          display_name: 'Input Parameters',
          location: [1200, 1640],
          name: 'parameters_1',
          type: 'inputparameters',
          parameters: [
            {
              name: 'before_raster',
              display_name: 'Before Raster (Time 1)',
              description: 'Raster from the earlier time period',
              type: 'ENVIRaster',
            },
            {
              name: 'after_raster',
              display_name: 'After Raster (Time 2)',
              description: 'Raster from the later time period',
              type: 'ENVIRaster',
            },
          ],
        },
        {
          display_name: 'Image Intersection',
          location: [1400, 1490],
          name: 'task_1',
          type: 'task',
          envitask: {
            name: 'ImageIntersection',
          },
        },
        {
          display_name: 'SAM Image Difference',
          location: [1600, 1490],
          name: 'task_2',
          type: 'task',
          envitask: {
            name: 'SAMImageDifference',
          },
        },
        {
          display_name: 'Output Parameters',
          location: [1800, 1490],
          name: 'parameters_2',
          type: 'outputparameters',
        },
        {
          display_name:
            'Clip both images to the same spatial extent and pixel grid',
          location: [1400, 1400],
          name: 'comment_1',
          type: 'comment',
        },
        {
          display_name:
            'Compute spectral-angle difference; smaller angle = less change',
          location: [1600, 1400],
          name: 'comment_2',
          type: 'comment',
        },
      ],
      edges: [
        {
          from_node: 'parameters_1',
          from_parameters: ['before_raster'],
          to_node: 'task_1',
          to_parameters: ['input_raster1'],
        },
        {
          from_node: 'parameters_1',
          from_parameters: ['after_raster'],
          to_node: 'task_1',
          to_parameters: ['input_raster2'],
        },
        {
          from_node: 'task_1',
          from_parameters: ['output_raster1'],
          to_node: 'task_2',
          to_parameters: ['input_raster1'],
        },
        {
          from_node: 'task_1',
          from_parameters: ['output_raster2'],
          to_node: 'task_2',
          to_parameters: ['input_raster2'],
        },
        {
          from_node: 'task_2',
          from_parameters: ['output_raster'],
          to_node: 'parameters_2',
          to_parameters: [''],
        },
      ],
    } as Record<string, unknown>;

    // verify workflow
    expect(CreateENVIModelerWorkflow(nodes, edges, registry)).toEqual(
      expectedWorkflow,
    );
  });
});
