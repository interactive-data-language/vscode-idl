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

describe(`[auto generated] Spectral index + layer stack + ISODATA classification workflow`, () => {
  it(`[auto generated] for the happy path`, () => {
    // define nodes
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

    // define edges
    const edges: ENVIModelerEdge[] = [
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
        to_parameters: ['input_raster'],
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
          display_name: 'Spectral Index',
          location: [1800, 1490],
          name: 'task_3',
          type: 'task',
          envitask: {
            name: 'SpectralIndex',
            static_input: {
              index: 'Normalized Difference Vegetation Index',
            },
          },
        },
        {
          display_name: 'Aggregator',
          location: [2000, 1490],
          name: 'aggregator_1',
          type: 'aggregator',
          revision: '1.0.0',
          extract: 1,
        },
        {
          display_name: 'Build Layer Stack',
          location: [2200, 1490],
          name: 'task_4',
          type: 'task',
          envitask: {
            name: 'BuildLayerStack',
          },
        },
        {
          display_name: 'ISODATA Classification',
          location: [2400, 1490],
          name: 'task_5',
          type: 'task',
          envitask: {
            name: 'ISODATAClassification',
          },
        },
        {
          display_name: 'Data Manager',
          location: [2600, 1640],
          name: 'dataManager_1',
          type: 'datamanager',
          revision: '1.0.0',
        },
        {
          display_name: 'Output Parameters',
          location: [2600, 1490],
          name: 'parameters_2',
          type: 'outputparameters',
        },
        {
          display_name: 'Compute NDVI for Raster 1',
          location: [1400, 1400],
          name: 'comment_1',
          type: 'comment',
        },
        {
          display_name: 'Compute NDVI for Raster 2',
          location: [1600, 1400],
          name: 'comment_2',
          type: 'comment',
        },
        {
          display_name: 'Compute NDVI for Raster 3',
          location: [1800, 1400],
          name: 'comment_3',
          type: 'comment',
        },
        {
          display_name:
            'Stack all three spectral index rasters into a single multi-band image',
          location: [2200, 1400],
          name: 'comment_4',
          type: 'comment',
        },
        {
          display_name:
            'Unsupervised classification of the stacked spectral indices',
          location: [2400, 1400],
          name: 'comment_5',
          type: 'comment',
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
          from_node: 'parameters_1',
          from_parameters: ['raster3'],
          to_node: 'task_3',
          to_parameters: ['input_raster'],
        },
        {
          from_node: 'task_4',
          from_parameters: ['output_raster'],
          to_node: 'task_5',
          to_parameters: ['input_raster'],
        },
        {
          from_node: 'task_5',
          from_parameters: ['output_raster'],
          to_node: 'dataManager_1',
          to_parameters: ['input_raster'],
        },
        {
          from_node: 'task_5',
          from_parameters: ['output_raster'],
          to_node: 'parameters_2',
          to_parameters: [''],
        },
        {
          from_node: 'task_1',
          from_parameters: ['output_raster'],
          to_node: 'aggregator_1',
          to_parameters: [''],
        },
        {
          from_node: 'task_2',
          from_parameters: ['output_raster'],
          to_node: 'aggregator_1',
          to_parameters: [''],
        },
        {
          from_node: 'task_3',
          from_parameters: ['output_raster'],
          to_node: 'aggregator_1',
          to_parameters: [''],
        },
        {
          from_node: 'aggregator_1',
          from_parameters: ['output'],
          to_node: 'task_4',
          to_parameters: ['input_rasters'],
        },
      ],
    } as Record<string, unknown>;

    // verify workflow
    expect(CreateENVIModelerWorkflow(nodes, edges, registry)).toEqual(
      expectedWorkflow,
    );
  });
});
