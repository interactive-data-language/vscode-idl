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

describe(`[auto generated] DataManager and View node validation`, () => {
  it(`[auto generated] allows valid types for datamanager (ENVIRaster)`, () => {
    // define nodes
    const nodes: ENVIModelerNode[] = [
      {
        id: 'input_params',
        type: 'inputparameters',
        parameters: [
          {
            name: 'input_raster',
            display_name: 'Input Raster',
            description: 'A raster',
            type: 'ENVIRaster',
          },
        ],
      },
      {
        id: 'spectral_index',
        type: 'task',
        task_name: 'SpectralIndex',
        static_input: {
          index: 'Normalized Difference Vegetation Index',
        },
      },
      {
        id: 'datamanager',
        type: 'datamanager',
      },
    ];

    // define edges
    const edges: ENVIModelerEdge[] = [
      {
        from: 'input_params',
        from_parameters: ['input_raster'],
        to: 'spectral_index',
        to_parameters: ['input_raster'],
      },
      {
        from: 'spectral_index',
        from_parameters: ['output_raster'],
        to: 'datamanager',
        to_parameters: ['input_raster'],
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
              description: 'A raster',
              type: 'ENVIRaster',
            },
          ],
        },
        {
          display_name: 'Spectral Index',
          location: [1400, 1490],
          name: 'task_1',
          type: 'task',
          envitask: {
            name: 'SpectralIndex',
            static_input: {
              index: 'Normalized Difference Vegetation Index',
            },
          },
        },
        {
          display_name: 'Data Manager',
          location: [1600, 1490],
          name: 'dataManager_1',
          type: 'datamanager',
          revision: '1.0.0',
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
          from_node: 'task_1',
          from_parameters: ['output_raster'],
          to_node: 'dataManager_1',
          to_parameters: ['input_raster'],
        },
      ],
    } as Record<string, unknown>;

    // verify workflow
    expect(CreateENVIModelerWorkflow(nodes, edges, registry)).toEqual(
      expectedWorkflow,
    );
  });

  it(`[auto generated] allows valid types for view (ENVIRaster)`, () => {
    // define nodes
    const nodes: ENVIModelerNode[] = [
      {
        id: 'input_params',
        type: 'inputparameters',
        parameters: [
          {
            name: 'input_raster',
            display_name: 'Input Raster',
            description: 'A raster',
            type: 'ENVIRaster',
          },
        ],
      },
      {
        id: 'spectral_index',
        type: 'task',
        task_name: 'SpectralIndex',
        static_input: {
          index: 'Normalized Difference Vegetation Index',
        },
      },
      {
        id: 'view',
        type: 'view',
      },
    ];

    // define edges
    const edges: ENVIModelerEdge[] = [
      {
        from: 'input_params',
        from_parameters: ['input_raster'],
        to: 'spectral_index',
        to_parameters: ['input_raster'],
      },
      {
        from: 'spectral_index',
        from_parameters: ['output_raster'],
        to: 'view',
        to_parameters: ['input_raster'],
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
              description: 'A raster',
              type: 'ENVIRaster',
            },
          ],
        },
        {
          display_name: 'Spectral Index',
          location: [1400, 1490],
          name: 'task_1',
          type: 'task',
          envitask: {
            name: 'SpectralIndex',
            static_input: {
              index: 'Normalized Difference Vegetation Index',
            },
          },
        },
        {
          display_name: 'View',
          location: [1600, 1490],
          name: 'view_1',
          type: 'view',
          revision: '1.0.0',
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
          from_node: 'task_1',
          from_parameters: ['output_raster'],
          to_node: 'view_1',
          to_parameters: ['input_raster'],
        },
      ],
    } as Record<string, unknown>;

    // verify workflow
    expect(CreateENVIModelerWorkflow(nodes, edges, registry)).toEqual(
      expectedWorkflow,
    );
  });

  it(`[auto generated] allows multiple connections to datamanager`, () => {
    // define nodes
    const nodes: ENVIModelerNode[] = [
      {
        id: 'input_params',
        type: 'inputparameters',
        parameters: [
          {
            name: 'raster1',
            display_name: 'Raster 1',
            description: 'First raster',
            type: 'ENVIRaster',
          },
          {
            name: 'raster2',
            display_name: 'Raster 2',
            description: 'Second raster',
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
      },
      {
        id: 'si2',
        type: 'task',
        task_name: 'SpectralIndex',
        static_input: {
          index: 'Normalized Difference Vegetation Index',
        },
      },
      {
        id: 'datamanager',
        type: 'datamanager',
      },
    ];

    // define edges
    const edges: ENVIModelerEdge[] = [
      {
        from: 'input_params',
        from_parameters: ['raster1'],
        to: 'si1',
        to_parameters: ['input_raster'],
      },
      {
        from: 'input_params',
        from_parameters: ['raster2'],
        to: 'si2',
        to_parameters: ['input_raster'],
      },
      {
        from: 'si1',
        from_parameters: ['output_raster'],
        to: 'datamanager',
        to_parameters: ['input_raster'],
      },
      {
        from: 'si2',
        from_parameters: ['output_raster'],
        to: 'datamanager',
        to_parameters: ['input_raster'],
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
              name: 'raster1',
              display_name: 'Raster 1',
              description: 'First raster',
              type: 'ENVIRaster',
            },
            {
              name: 'raster2',
              display_name: 'Raster 2',
              description: 'Second raster',
              type: 'ENVIRaster',
            },
          ],
        },
        {
          display_name: 'Spectral Index',
          location: [1400, 1490],
          name: 'task_1',
          type: 'task',
          envitask: {
            name: 'SpectralIndex',
            static_input: {
              index: 'Normalized Difference Vegetation Index',
            },
          },
        },
        {
          display_name: 'Spectral Index',
          location: [1600, 1490],
          name: 'task_2',
          type: 'task',
          envitask: {
            name: 'SpectralIndex',
            static_input: {
              index: 'Normalized Difference Vegetation Index',
            },
          },
        },
        {
          display_name: 'Data Manager',
          location: [1800, 1490],
          name: 'dataManager_1',
          type: 'datamanager',
          revision: '1.0.0',
        },
      ],
      edges: [
        {
          from_node: 'parameters_1',
          from_parameters: ['raster1'],
          to_node: 'task_1',
          to_parameters: ['input_raster'],
        },
        {
          from_node: 'parameters_1',
          from_parameters: ['raster2'],
          to_node: 'task_2',
          to_parameters: ['input_raster'],
        },
        {
          from_node: 'task_1',
          from_parameters: ['output_raster'],
          to_node: 'dataManager_1',
          to_parameters: ['input_raster'],
        },
        {
          from_node: 'task_2',
          from_parameters: ['output_raster'],
          to_node: 'dataManager_1',
          to_parameters: ['input_raster'],
        },
      ],
    } as Record<string, unknown>;

    // verify workflow
    expect(CreateENVIModelerWorkflow(nodes, edges, registry)).toEqual(
      expectedWorkflow,
    );
  });

  it(`[auto generated] allows ENVIVector for datamanager`, () => {
    // define nodes
    const nodes: ENVIModelerNode[] = [
      {
        id: 'input_params',
        type: 'inputparameters',
        parameters: [
          {
            name: 'input_vector',
            display_name: 'Input Vector',
            description: 'A vector',
            type: 'ENVIVector',
          },
        ],
      },
      {
        id: 'buffer',
        type: 'task',
        task_name: 'VectorRecordsToBoundingBox',
      },
      {
        id: 'datamanager',
        type: 'datamanager',
      },
    ];

    // define edges
    const edges: ENVIModelerEdge[] = [
      {
        from: 'input_params',
        from_parameters: ['input_vector'],
        to: 'buffer',
        to_parameters: ['input_vector'],
      },
      {
        from: 'buffer',
        from_parameters: ['output_vector'],
        to: 'datamanager',
        to_parameters: ['input_vector'],
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
              name: 'input_vector',
              display_name: 'Input Vector',
              description: 'A vector',
              type: 'ENVIVector',
            },
          ],
        },
        {
          display_name: 'Vector Records to Bounding Box',
          location: [1400, 1490],
          name: 'task_1',
          type: 'task',
          envitask: {
            name: 'VectorRecordsToBoundingBox',
          },
        },
        {
          display_name: 'Data Manager',
          location: [1600, 1490],
          name: 'dataManager_1',
          type: 'datamanager',
          revision: '1.0.0',
        },
      ],
      edges: [
        {
          from_node: 'parameters_1',
          from_parameters: ['input_vector'],
          to_node: 'task_1',
          to_parameters: ['input_vector'],
        },
        {
          from_node: 'task_1',
          from_parameters: ['output_vector'],
          to_node: 'dataManager_1',
          to_parameters: ['input_vector'],
        },
      ],
    } as Record<string, unknown>;

    // verify workflow
    expect(CreateENVIModelerWorkflow(nodes, edges, registry)).toEqual(
      expectedWorkflow,
    );
  });

  it(`[auto generated] rejects array type for view`, () => {
    // define nodes
    const nodes: ENVIModelerNode[] = [
      {
        id: 'task1',
        type: 'task',
        task_name: 'DiceRasterByTileCount',
      },
      {
        id: 'view',
        type: 'view',
      },
    ];

    // define edges
    const edges: ENVIModelerEdge[] = [
      {
        from: 'task1',
        from_parameters: ['output_raster'],
        to: 'view',
        to_parameters: [],
      },
    ];

    // validate nodes
    const errors = ValidateENVIModelerWorkflow(nodes, edges, registry);

    // define expected errors
    const expectedErrors: string[] = [
      'The "from_parameters" property on edge node 0 (zero-based) has problems that need resolved:',
      '  "output_raster" is an array parameters and cannot be connected to view',
    ];

    // verify errors
    expect(errors).toEqual(expectedErrors);
  });

  it(`[auto generated] rejects array type for data manager`, () => {
    // define nodes
    const nodes: ENVIModelerNode[] = [
      {
        id: 'task1',
        type: 'task',
        task_name: 'DiceRasterByTileCount',
      },
      {
        id: 'dm',
        type: 'datamanager',
      },
    ];

    // define edges
    const edges: ENVIModelerEdge[] = [
      {
        from: 'task1',
        from_parameters: ['output_raster'],
        to: 'dm',
        to_parameters: [],
      },
    ];

    // validate nodes
    const errors = ValidateENVIModelerWorkflow(nodes, edges, registry);

    // define expected errors
    const expectedErrors: string[] = [
      'The "from_parameters" property on edge node 0 (zero-based) has problems that need resolved:',
      '  "output_raster" is an array parameters and cannot be connected to datamanager',
    ];

    // verify errors
    expect(errors).toEqual(expectedErrors);
  });
});
