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

describe(`[auto generated] ISODATA classification with output URI`, () => {
  it(`[auto generated] for the happy path`, () => {
    // define nodes
    const nodes: ENVIModelerNode[] = [
      {
        id: 'inputs',
        type: 'inputparameters',
        parameters: [
          {
            name: 'input_raster',
            display_name: 'Input Raster',
            description: 'Raster to classify using ISODATA unsupervised method',
            type: 'ENVIRaster',
          },
          {
            name: 'output_raster_uri',
            display_name: 'Output Raster URI',
            description:
              'Fully-qualified path for the output classification raster',
            type: 'String',
          },
        ],
      },
      {
        id: 'isodata',
        type: 'task',
        task_name: 'ISODATAClassification',
        comment:
          'Cluster pixels into classes using the ISODATA unsupervised algorithm',
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
        from_parameters: ['input_raster'],
        to: 'isodata',
        to_parameters: ['input_raster'],
      },
      {
        from: 'inputs',
        from_parameters: ['output_raster_uri'],
        to: 'isodata',
        to_parameters: ['output_raster_uri'],
      },
      {
        from: 'isodata',
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
              name: 'input_raster',
              display_name: 'Input Raster',
              description:
                'Raster to classify using ISODATA unsupervised method',
              type: 'ENVIRaster',
            },
            {
              name: 'output_raster_uri',
              display_name: 'Output Raster URI',
              description:
                'Fully-qualified path for the output classification raster',
              type: 'String',
            },
          ],
        },
        {
          display_name: 'ISODATA Classification',
          location: [1400, 1490],
          name: 'task_1',
          type: 'task',
          envitask: {
            name: 'ISODATAClassification',
          },
        },
        {
          display_name: 'Output Parameters',
          location: [1600, 1490],
          name: 'parameters_2',
          type: 'outputparameters',
        },
        {
          display_name:
            'Cluster pixels into classes using the ISODATA unsupervised algorithm',
          location: [1400, 1400],
          name: 'comment_1',
          type: 'comment',
        },
      ],
      edges: [
        {
          from_node: 'parameters_1',
          from_parameters: ['input_raster'],
          to_node: 'task_1',
          to_parameters: ['input_raster'],
        },
        {
          from_node: 'parameters_1',
          from_parameters: ['output_raster_uri'],
          to_node: 'task_1',
          to_parameters: ['output_raster_uri'],
        },
        {
          from_node: 'task_1',
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
