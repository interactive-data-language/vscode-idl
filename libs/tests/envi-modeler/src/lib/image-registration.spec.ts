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

describe(`[auto generated] Generic image registration workflow`, () => {
  it(`[auto generated] for the happy path`, () => {
    // define nodes
    const nodes: ENVIModelerNode[] = [
      {
        id: 'inputs',
        type: 'inputparameters',
        parameters: [
          {
            name: 'base_raster',
            display_name: 'Base Raster (Reference)',
            description: 'Reference image with accurate georeferencing',
            type: 'ENVIRaster',
          },
          {
            name: 'warp_raster',
            display_name: 'Warp Raster',
            description: 'Image to be aligned to the base raster',
            type: 'ENVIRaster',
          },
        ],
      },
      {
        id: 'gen_tiepoints',
        type: 'task',
        task_name: 'GenerateTiePointsByCrossCorrelation',
        comment: 'Automatically match features between base and warp images',
      },
      {
        id: 'filter_tiepoints',
        type: 'task',
        task_name: 'FilterTiePointsByGlobalTransform',
        comment: 'Remove outlier tie points using global transform',
      },
      {
        id: 'register',
        type: 'task',
        task_name: 'ImageToImageRegistration',
        static_input: {
          warping: 'Triangulation',
        },
        comment:
          'Warp the image to align with the base raster using Triangulation',
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
        from_parameters: ['base_raster'],
        to: 'gen_tiepoints',
        to_parameters: ['input_raster1'],
      },
      {
        from: 'inputs',
        from_parameters: ['warp_raster'],
        to: 'gen_tiepoints',
        to_parameters: ['input_raster2'],
      },
      {
        from: 'gen_tiepoints',
        from_parameters: ['output_tiepoints'],
        to: 'filter_tiepoints',
        to_parameters: ['input_tiepoints'],
      },
      {
        from: 'filter_tiepoints',
        from_parameters: ['output_tiepoints'],
        to: 'register',
        to_parameters: ['input_tiepoints'],
      },
      {
        from: 'register',
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
              name: 'base_raster',
              display_name: 'Base Raster (Reference)',
              description: 'Reference image with accurate georeferencing',
              type: 'ENVIRaster',
            },
            {
              name: 'warp_raster',
              display_name: 'Warp Raster',
              description: 'Image to be aligned to the base raster',
              type: 'ENVIRaster',
            },
          ],
        },
        {
          display_name: 'Generate Tie Points by Cross Correlation',
          location: [1400, 1490],
          name: 'task_1',
          type: 'task',
          envitask: {
            name: 'GenerateTiePointsByCrossCorrelation',
          },
        },
        {
          display_name: 'Filter Tie Point by Global Transform',
          location: [1600, 1490],
          name: 'task_2',
          type: 'task',
          envitask: {
            name: 'FilterTiePointsByGlobalTransform',
          },
        },
        {
          display_name: 'Image to Image Registration',
          location: [1800, 1490],
          name: 'task_3',
          type: 'task',
          envitask: {
            name: 'ImageToImageRegistration',
            static_input: {
              warping: 'Triangulation',
            },
          },
        },
        {
          display_name: 'Output Parameters',
          location: [2000, 1490],
          name: 'parameters_2',
          type: 'outputparameters',
        },
        {
          display_name:
            'Automatically match features between base and warp images',
          location: [1400, 1400],
          name: 'comment_1',
          type: 'comment',
        },
        {
          display_name: 'Remove outlier tie points using global transform',
          location: [1600, 1400],
          name: 'comment_2',
          type: 'comment',
        },
        {
          display_name:
            'Warp the image to align with the base raster using Triangulation',
          location: [1800, 1400],
          name: 'comment_3',
          type: 'comment',
        },
      ],
      edges: [
        {
          from_node: 'parameters_1',
          from_parameters: ['base_raster'],
          to_node: 'task_1',
          to_parameters: ['input_raster1'],
        },
        {
          from_node: 'parameters_1',
          from_parameters: ['warp_raster'],
          to_node: 'task_1',
          to_parameters: ['input_raster2'],
        },
        {
          from_node: 'task_1',
          from_parameters: ['output_tiepoints'],
          to_node: 'task_2',
          to_parameters: ['input_tiepoints'],
        },
        {
          from_node: 'task_2',
          from_parameters: ['output_tiepoints'],
          to_node: 'task_3',
          to_parameters: ['input_tiepoints'],
        },
        {
          from_node: 'task_3',
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
