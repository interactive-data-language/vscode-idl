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

// disable logs
logManager.setInterceptor(() => {
  // do nothing
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

describe(`[auto generated] Text sanitization for special characters`, () => {
  it(`[auto generated] removes emojis and control characters`, () => {
    // define nodes
    const nodes: ENVIModelerNode[] = [
      {
        id: 'input_params',
        type: 'inputparameters',
        display_name: 'Input Parameters 🚀',
        parameters: [
          {
            name: 'input_raster',
            display_name: 'Input File 📁',
            description:
              'Select your input raster file\u0000with embedded null character',
            type: 'ENVIRaster',
          },
          {
            name: 'threshold_value',
            display_name: 'Threshold Value ⚡',
            description: 'Enter threshold\u0001\u0002\u0003with control chars',
            type: 'Double',
          },
        ],
        comment: 'Input parameters with emojis 🎯 and special chars',
      },
      {
        id: 'process_task',
        type: 'task',
        display_name: 'Process Data 🔥',
        task_name: 'SpectralIndex',
        comment:
          'Processing step\nwith emoji 💡 and\u0000null\u001fcontrol chars',
      },
      {
        id: 'output_params',
        type: 'outputparameters',
        display_name: 'Output Results ✨',
      },
      {
        id: 'view_result',
        type: 'view',
        display_name: 'View Output 👀',
        comment: 'Display finalresult with high control char',
      },
    ];

    // define edges
    const edges: ENVIModelerEdge[] = [
      {
        from: 'input_params',
        from_parameters: ['input_raster'],
        to: 'process_task',
        to_parameters: ['input_raster'],
      },
      {
        from: 'input_params',
        from_parameters: ['threshold_value'],
        to: 'process_task',
        to_parameters: ['index'],
      },
      {
        from: 'process_task',
        from_parameters: ['output_raster'],
        to: 'output_params',
        to_parameters: ['output_raster'],
      },
      {
        from: 'process_task',
        from_parameters: ['output_raster'],
        to: 'view_result',
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
              display_name: 'Input File',
              description:
                'Select your input raster filewith embedded null character',
              type: 'ENVIRaster',
            },
            {
              name: 'threshold_value',
              display_name: 'Threshold Value',
              description: 'Enter thresholdwith control chars',
              type: 'Double',
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
          },
        },
        {
          display_name: 'Output Parameters',
          location: [1600, 1490],
          name: 'parameters_2',
          type: 'outputparameters',
        },
        {
          display_name: 'View',
          location: [1600, 1640],
          name: 'view_1',
          type: 'view',
          revision: '1.0.0',
        },
        {
          display_name: 'Input parameters with emojis  and special chars',
          location: [1200, 1550],
          name: 'comment_1',
          type: 'comment',
        },
        {
          display_name: 'Processing stepwith emoji  andnullcontrol chars',
          location: [1400, 1400],
          name: 'comment_2',
          type: 'comment',
        },
        {
          display_name: 'Display finalresult with high control char',
          location: [1600, 1550],
          name: 'comment_3',
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
          from_parameters: ['threshold_value'],
          to_node: 'task_1',
          to_parameters: ['index'],
        },
        {
          from_node: 'task_1',
          from_parameters: ['output_raster'],
          to_node: 'parameters_2',
          to_parameters: ['output_raster'],
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

  it(`[auto generated] preserves international characters`, () => {
    // define nodes
    const nodes: ENVIModelerNode[] = [
      {
        id: 'input_params',
        type: 'inputparameters',
        display_name: "Paramètres d'entrée",
        parameters: [
          {
            name: 'fichier',
            display_name: "Fichier d'entrée",
            description: "Sélectionnez votre fichier d'entrée",
            type: 'ENVIRaster',
          },
        ],
        comment: 'Paramètres en français',
      },
      {
        id: 'process',
        type: 'task',
        display_name: 'Procesamiento de Datos',
        task_name: 'SpectralIndex',
        comment: 'Paso de procesamiento en español',
      },
      {
        id: 'ausgabe',
        type: 'outputparameters',
        display_name: 'Ausgabeparameter',
      },
    ];

    // define edges
    const edges: ENVIModelerEdge[] = [
      {
        from: 'input_params',
        from_parameters: ['fichier'],
        to: 'process',
        to_parameters: ['input_raster'],
      },
      {
        from: 'process',
        from_parameters: ['output_raster'],
        to: 'ausgabe',
        to_parameters: ['output_raster'],
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
              name: 'fichier',
              display_name: "Fichier d'entrée",
              description: "Sélectionnez votre fichier d'entrée",
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
          },
        },
        {
          display_name: 'Output Parameters',
          location: [1600, 1490],
          name: 'parameters_2',
          type: 'outputparameters',
        },
        {
          display_name: 'Paramètres en français',
          location: [1200, 1550],
          name: 'comment_1',
          type: 'comment',
        },
        {
          display_name: 'Paso de procesamiento en español',
          location: [1400, 1400],
          name: 'comment_2',
          type: 'comment',
        },
      ],
      edges: [
        {
          from_node: 'parameters_1',
          from_parameters: ['fichier'],
          to_node: 'task_1',
          to_parameters: ['input_raster'],
        },
        {
          from_node: 'task_1',
          from_parameters: ['output_raster'],
          to_node: 'parameters_2',
          to_parameters: ['output_raster'],
        },
      ],
    } as Record<string, unknown>;

    // verify workflow
    expect(CreateENVIModelerWorkflow(nodes, edges, registry)).toEqual(
      expectedWorkflow,
    );
  });
});
