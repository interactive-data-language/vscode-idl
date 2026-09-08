import { IAutoENVIModelerTest } from '../../tests.interface';

export const AUTO_ENVI_MODELER_TEST_TEXT_SANITIZATION: IAutoENVIModelerTest = {
  suiteName: 'Text sanitization for special characters',
  fileName: 'text-sanitization.1.spec.ts',
  tests: [
    {
      name: 'removes emojis and control characters',
      nodes: [
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
              description:
                'Enter threshold\u0001\u0002\u0003with control chars',
              type: 'Double',
            },
          ],
          comment: 'Input parameters with emojis 🎯 and special chars\u007F',
        },
        {
          id: 'process_task',
          type: 'task',
          display_name: 'Process Data 🔥',
          task_name: 'SpectralIndex',
          comment:
            'Processing step\nwith emoji 💡 and\u0000null\u001Fcontrol chars',
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
          comment: 'Display final\u009Fresult with high control char',
        },
      ],
      edges: [
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
      ],
    },
    {
      name: 'preserves international characters',
      nodes: [
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
      ],
      edges: [
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
      ],
    },
  ],
};
