import { CancellationToken } from '@idl/cancellation-tokens';
import {
  GenerateENVITask,
  GenerateENVITaskMainLevelProgram,
} from '@idl/generators/envi-task';
import {
  GenerateIDLTask,
  GenerateIDLTaskMainLevelProgram,
} from '@idl/generators/idl-task';
import { GenerateTaskResult } from '@idl/generators/tasks-shared';
import { LogManager } from '@idl/logger';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { LoadTask } from '@idl/schemas/tasks';
import { GetExtensionPath } from '@idl/shared';
import { readFileSync } from 'fs';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] Make basic ENVI task`, () => {
  it(`[auto generated] from PRO`, async () => {
    // create index
    const index = new IDLIndex(
      new LogManager({
        alert: () => {
          // do nothing
        },
      }),
      0
    );

    // specify type of task
    const taskType = 'envi' as string;

    // specify filepath
    const filepath = GetExtensionPath(
      'idl/test/task-generation/envitasktest.pro'
    );

    // add file to index
    const parsed = await index.getParsedProCode(
      filepath,
      readFileSync(filepath, 'utf-8'),
      new CancellationToken(),
      { postProcess: true }
    );

    // make our task
    const result =
      taskType === 'envi'
        ? await GenerateENVITask(filepath, parsed)
        : await GenerateIDLTask(filepath, parsed);

    // verify success
    expect(result.success).toBeTruthy();

    // define expected task
    const expectedTask = {
      schema: 'envitask_3.3',
      name: 'envitasktest',
      display_name: 'Envitasktest',
      base_class: 'ENVITaskFromProcedure',
      routine: 'envitasktest',
      description: '',
      parameters: [
        {
          name: 'input_array',
          display_name: 'Input Array',
          description: 'Placeholder docs for argument, keyword, or property',
          type: 'ENVIRasterArray',
          required: true,
          direction: 'input',
          dimensions: '[*]',
        },
        {
          name: 'input_raster',
          display_name: 'Input Raster',
          description: 'Placeholder docs for argument, keyword, or property',
          type: 'ENVIRaster',
          required: true,
          direction: 'input',
        },
        {
          name: 'output_raster_uri',
          display_name: 'Output Raster Uri',
          description: 'Placeholder docs for argument, keyword, or property',
          type: 'ENVIURI',
          required: true,
          direction: 'input',
          auto_extension: '.dat',
        },
        {
          name: 'output_raster',
          display_name: 'output_raster',
          description: 'A reference to the ENVIRaster that is generated',
          type: 'ENVIRaster',
          required: true,
          direction: 'output',
          uri_param: 'output_raster_uri',
        },
        {
          name: 'output_vector_uri',
          display_name: 'Output Vector Uri',
          description: 'Placeholder docs for argument, keyword, or property',
          type: 'ENVIURI',
          required: true,
          direction: 'input',
          auto_extension: '.shp',
        },
        {
          name: 'output_vector',
          display_name: 'output_vector',
          description: 'A reference to the ENVIVector that is generated',
          type: 'ENVIVector',
          required: true,
          direction: 'output',
          uri_param: 'output_vector_uri',
        },
      ],
    };

    // verify results
    expect((result as GenerateTaskResult<true>).task).toEqual(expectedTask);

    // define expected main
    const expectedMain = [
      '',
      '; Main level program',
      'compile_opt idl2',
      '',
      ';+ Start ENVI (feel free to add "/headless" so the UI does not appear)',
      'e = envi()',
      '',
      ';+',
      '; This code always loads the latest task from disk for ENVI',
      '; to be aware of',
      ';',
      '; If you make changes to your task, the next time you run this, ',
      '; ENVI will pick them up and is great for easy development',
      ';+',
      "myTask = ENVITask(routine_dir() + 'envitasktest.task')",
      '',
      '; TODO: set task parameters',
      'myTask.input_array = !null',
      'myTask.input_raster = !null',
      'myTask.output_raster_uri = !null',
      'myTask.output_vector_uri = !null',
      '',
      '; run our awesome task',
      'myTask.execute',
      '',
      ';+',
      '; If you have problems with your task, it can be easier to run',
      '; as a procedure instead',
      ';',
      '; Remove the return statement just below to run our procedure instead of',
      '; the task, but remember to comment out the task execution code above so',
      "; things don't run twice!",
      ';-',
      'return',
      '',
      '; Set/reset the values of output keywords so we have a fresh run',
      'output_raster_uri = !null',
      'output_vector_uri = !null',
      '',
      ';+',
      '; Run our procedure',
      '; ',
      '; TODO: Set keywords',
      ';-',
      'envitasktest, $',
      '  input_array = !null, $',
      '  input_raster = !null, $',
      '  output_raster_uri = output_raster_uri, $',
      '  output_vector_uri = output_vector_uri',
      '',
      'end',
    ];

    // make our main level program
    const mainAdd =
      taskType === 'envi'
        ? GenerateENVITaskMainLevelProgram(result as GenerateTaskResult<true>)
        : GenerateIDLTaskMainLevelProgram(result as GenerateTaskResult<true>);

    // verify result
    expect(mainAdd.split('\n')).toEqual(expectedMain);

    // verify we can parse our created task
    await LoadTask(
      'mytask.task',
      (result as GenerateTaskResult<true>).formattedTask
    );
  });
});
