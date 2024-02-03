import { LogManager } from '@idl/logger';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { GetExtensionPath } from '@idl/shared';
import { readFile } from 'fs/promises';
import { CompletionItem, Position } from 'vscode-languageserver/node';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] Task auto complete`, () => {
  it(`[auto generated] to auto-populate task names`, async () => {
    // create index
    const index = new IDLIndex(
      new LogManager({
        alert: () => {
          // do nothing
        },
      }),
      0
    );

    // specify filepath
    const filepath = GetExtensionPath(
      'idl/test/auto-complete/task_completion.pro'
    );

    // add file to index
    await index.indexFile(filepath);

    // define position
    const position_0: Position = { line: 3, character: 17 };

    // define expected token we extract
    const expectedFound_0: CompletionItem[] = [
      {
        label: 'commute_on_downsample = ',
        insertText: 'commute_on_downsample = ',
        kind: 20,
        sortText: '00',
        detail: 'Keyword',
        documentation: {
          kind: 'markdown',
          value:
            'A string that defines whether the result of running the ENVITask first, then down-sampling the output raster, matches the result of down-sampling the input raster(s) first before running the ENVITask.\n\nAn ENVITask developer can use the scripts provided in More Examples below to determine the COMMUTE\\_ON\\_DOWNSAMPLE property value when creating an ENVITask.\n\nValid values are:\n\n`Yes:` Downsample the input raster(s) first, and then run the task. The resulting output raster matches the result if the task is run first, then downsample the output raster.\n\n`Approximate:` The two results look close to each other, but do not exactly match.\n\n`No:` The two results are significantly different.\n\n`Unknown:` The property value is unknown.',
        },
      },
      {
        label: 'commute_on_subset = ',
        insertText: 'commute_on_subset = ',
        kind: 20,
        sortText: '00',
        detail: 'Keyword',
        documentation: {
          kind: 'markdown',
          value:
            'A string that defines whether the result of running the ENVITask first, then subsetting the output raster, matches the result of subsetting the input raster(s) first before running the ENVITask.\n\nAn ENVITask developer can use the scripts provided in More Examples below to determine the COMMUTE\\_ON\\_SUBSET property value when creating an ENVITask.\n\nValid values are:\n\n* `Yes:` Subset the input raster(s) first, and then run the task. The resulting output raster matches the result if the task is run first, then subset the output raster.\n* `Approximate:` The two results look close to each other, but do not exactly match.\n* `No:` The two results are significantly different.\n* `Unknown:` The property value is unknown.',
        },
      },
      {
        label: 'description = ',
        insertText: 'description = ',
        kind: 20,
        sortText: '00',
        detail: 'Keyword',
        documentation: { kind: 'markdown', value: 'Text describing the task.' },
      },
      {
        label: 'display_name = ',
        insertText: 'display_name = ',
        kind: 20,
        sortText: '00',
        detail: 'Keyword',
        documentation: {
          kind: 'markdown',
          value: 'The name of the task as it appears in the user interface.',
        },
      },
      {
        label: 'name = ',
        insertText: 'name = ',
        kind: 20,
        sortText: '00',
        detail: 'Keyword',
        documentation: { kind: 'markdown', value: 'The name of the task.' },
      },
      {
        label: 'revision = ',
        insertText: 'revision = ',
        kind: 20,
        sortText: '00',
        detail: 'Keyword',
        documentation: {
          kind: 'markdown',
          value:
            'A string with the semantic revision number of the task. As the task definition evolves over time, the changes will affect how the revision number is incremented, according to [semantic versioning](command:idl.docs.openLink?%7B%22link%22:%22IDL_DOCS/../Subsystems/envi/Content/ExtendCustomize/ENVI%20Routine/ENVI.htm#API%255FVERS%22%7D) rules.',
        },
      },
      {
        label: 'source_uri = ',
        insertText: 'source_uri = ',
        kind: 20,
        sortText: '00',
        detail: 'Keyword',
        documentation: {
          kind: 'markdown',
          value:
            'The path and filename of the `.task` file that defines the task. If the task was created programmatically using OBJ\\_NEW, then SOURCE\\_URI will be an empty string.',
        },
      },
      {
        label: 'tags = ',
        insertText: 'tags = ',
        kind: 20,
        sortText: '00',
        detail: 'Keyword',
        documentation: {
          kind: 'markdown',
          value:
            'A scalar string or an array of strings that help categorize the task. It can be empty with a value of !NULL.',
        },
      },
      {
        label: 'error = ',
        insertText: 'error = ',
        kind: 20,
        sortText: '00',
        detail: 'Keyword',
        documentation: {
          kind: 'markdown',
          value:
            "Set this keyword to a named variable that will contain any error message issued during execution of this routine. If no error occurs, the ERROR variable will be set to a null string (`''`). If an error occurs and the routine is a function, then the function result will be undefined.\n\nWhen this keyword is not set and an error occurs, ENVI returns to the caller and execution halts. In this case, the error message is contained within !ERROR\\_STATE and can be caught using IDL's CATCH routine. See IDL Help for more information on !ERROR\\_STATE and CATCH.\n\nSee [Manage Errors](command:idl.docs.openLink?%7B%22link%22:%22IDL_DOCS/../Subsystems/envi/Content/ExtendCustomize/ProgrammingGuide/ErrorHandling.htm%22%7D) for more information on error handling in ENVI programming.",
        },
      },
      { label: '!x', kind: 21, sortText: '90', detail: 'System Variable' },
      { label: '!y', kind: 21, sortText: '90', detail: 'System Variable' },
      { label: '!z', kind: 21, sortText: '90', detail: 'System Variable' },
      { label: '!c', kind: 21, sortText: '90', detail: 'System Variable' },
      { label: '!d', kind: 21, sortText: '90', detail: 'System Variable' },
      { label: '!order', kind: 21, sortText: '90', detail: 'System Variable' },
      { label: '!p', kind: 21, sortText: '90', detail: 'System Variable' },
      { label: '!color', kind: 21, sortText: '90', detail: 'System Variable' },
      { label: '!const', kind: 21, sortText: '90', detail: 'System Variable' },
      { label: '!dpi', kind: 21, sortText: '90', detail: 'System Variable' },
      { label: '!dtor', kind: 21, sortText: '90', detail: 'System Variable' },
      { label: '!false', kind: 21, sortText: '90', detail: 'System Variable' },
      { label: '!map', kind: 21, sortText: '90', detail: 'System Variable' },
      { label: '!null', kind: 21, sortText: '90', detail: 'System Variable' },
      { label: '!pi', kind: 21, sortText: '90', detail: 'System Variable' },
      { label: '!radeg', kind: 21, sortText: '90', detail: 'System Variable' },
      { label: '!true', kind: 21, sortText: '90', detail: 'System Variable' },
      { label: '!values', kind: 21, sortText: '90', detail: 'System Variable' },
      { label: '!err', kind: 21, sortText: '90', detail: 'System Variable' },
      {
        label: '!error_state',
        kind: 21,
        sortText: '90',
        detail: 'System Variable',
      },
      { label: '!error', kind: 21, sortText: '90', detail: 'System Variable' },
      {
        label: '!err_string',
        kind: 21,
        sortText: '90',
        detail: 'System Variable',
      },
      { label: '!except', kind: 21, sortText: '90', detail: 'System Variable' },
      { label: '!mouse', kind: 21, sortText: '90', detail: 'System Variable' },
      {
        label: '!msg_prefix',
        kind: 21,
        sortText: '90',
        detail: 'System Variable',
      },
      {
        label: '!syserror',
        kind: 21,
        sortText: '90',
        detail: 'System Variable',
      },
      {
        label: '!syserr_string',
        kind: 21,
        sortText: '90',
        detail: 'System Variable',
      },
      { label: '!warn', kind: 21, sortText: '90', detail: 'System Variable' },
      { label: '!cpu', kind: 21, sortText: '90', detail: 'System Variable' },
      {
        label: '!debug_process_events',
        kind: 21,
        sortText: '90',
        detail: 'System Variable',
      },
      { label: '!dir', kind: 21, sortText: '90', detail: 'System Variable' },
      {
        label: '!dlm_path',
        kind: 21,
        sortText: '90',
        detail: 'System Variable',
      },
      {
        label: '!edit_input',
        kind: 21,
        sortText: '90',
        detail: 'System Variable',
      },
      {
        label: '!help_path',
        kind: 21,
        sortText: '90',
        detail: 'System Variable',
      },
      {
        label: '!journal',
        kind: 21,
        sortText: '90',
        detail: 'System Variable',
      },
      {
        label: '!make_dll',
        kind: 21,
        sortText: '90',
        detail: 'System Variable',
      },
      { label: '!more', kind: 21, sortText: '90', detail: 'System Variable' },
      {
        label: '!package_path',
        kind: 21,
        sortText: '90',
        detail: 'System Variable',
      },
      { label: '!path', kind: 21, sortText: '90', detail: 'System Variable' },
      { label: '!prompt', kind: 21, sortText: '90', detail: 'System Variable' },
      { label: '!quiet', kind: 21, sortText: '90', detail: 'System Variable' },
    ];

    // verify results
    expect(expectedFound_0).toEqual(
      (
        await index.getAutoComplete(
          filepath,
          await readFile(filepath, 'utf-8'),
          position_0
        )
      ).slice(0, 50)
    );
    // define position
    const position_1: Position = { line: 4, character: 16 };

    // define expected token we extract
    const expectedFound_1: CompletionItem[] = [
      {
        label: 'error = ',
        insertText: 'error = ',
        kind: 20,
        sortText: '00',
        detail: 'Keyword',
        documentation: {
          kind: 'markdown',
          value:
            "Set this keyword to a named variable that will contain any error message issued during execution. If no error occurs, the ERROR variable will be set to an empty string (`''`).\n\nWhen this keyword is not set and an error occurs, the function returns to the caller and execution halts. In this case, the error message is contained within !ERROR\\_STATE and can be caught using IDL's CATCH routine.",
        },
      },
      { label: '!x', kind: 21, sortText: '90', detail: 'System Variable' },
      { label: '!y', kind: 21, sortText: '90', detail: 'System Variable' },
      { label: '!z', kind: 21, sortText: '90', detail: 'System Variable' },
      { label: '!c', kind: 21, sortText: '90', detail: 'System Variable' },
      { label: '!d', kind: 21, sortText: '90', detail: 'System Variable' },
      { label: '!order', kind: 21, sortText: '90', detail: 'System Variable' },
      { label: '!p', kind: 21, sortText: '90', detail: 'System Variable' },
      { label: '!color', kind: 21, sortText: '90', detail: 'System Variable' },
      { label: '!const', kind: 21, sortText: '90', detail: 'System Variable' },
      { label: '!dpi', kind: 21, sortText: '90', detail: 'System Variable' },
      { label: '!dtor', kind: 21, sortText: '90', detail: 'System Variable' },
      { label: '!false', kind: 21, sortText: '90', detail: 'System Variable' },
      { label: '!map', kind: 21, sortText: '90', detail: 'System Variable' },
      { label: '!null', kind: 21, sortText: '90', detail: 'System Variable' },
      { label: '!pi', kind: 21, sortText: '90', detail: 'System Variable' },
      { label: '!radeg', kind: 21, sortText: '90', detail: 'System Variable' },
      { label: '!true', kind: 21, sortText: '90', detail: 'System Variable' },
      { label: '!values', kind: 21, sortText: '90', detail: 'System Variable' },
      { label: '!err', kind: 21, sortText: '90', detail: 'System Variable' },
      {
        label: '!error_state',
        kind: 21,
        sortText: '90',
        detail: 'System Variable',
      },
      { label: '!error', kind: 21, sortText: '90', detail: 'System Variable' },
      {
        label: '!err_string',
        kind: 21,
        sortText: '90',
        detail: 'System Variable',
      },
      { label: '!except', kind: 21, sortText: '90', detail: 'System Variable' },
      { label: '!mouse', kind: 21, sortText: '90', detail: 'System Variable' },
      {
        label: '!msg_prefix',
        kind: 21,
        sortText: '90',
        detail: 'System Variable',
      },
      {
        label: '!syserror',
        kind: 21,
        sortText: '90',
        detail: 'System Variable',
      },
      {
        label: '!syserr_string',
        kind: 21,
        sortText: '90',
        detail: 'System Variable',
      },
      { label: '!warn', kind: 21, sortText: '90', detail: 'System Variable' },
      { label: '!cpu', kind: 21, sortText: '90', detail: 'System Variable' },
      {
        label: '!debug_process_events',
        kind: 21,
        sortText: '90',
        detail: 'System Variable',
      },
      { label: '!dir', kind: 21, sortText: '90', detail: 'System Variable' },
      {
        label: '!dlm_path',
        kind: 21,
        sortText: '90',
        detail: 'System Variable',
      },
      {
        label: '!edit_input',
        kind: 21,
        sortText: '90',
        detail: 'System Variable',
      },
      {
        label: '!help_path',
        kind: 21,
        sortText: '90',
        detail: 'System Variable',
      },
      {
        label: '!journal',
        kind: 21,
        sortText: '90',
        detail: 'System Variable',
      },
      {
        label: '!make_dll',
        kind: 21,
        sortText: '90',
        detail: 'System Variable',
      },
      { label: '!more', kind: 21, sortText: '90', detail: 'System Variable' },
      {
        label: '!package_path',
        kind: 21,
        sortText: '90',
        detail: 'System Variable',
      },
      { label: '!path', kind: 21, sortText: '90', detail: 'System Variable' },
      { label: '!prompt', kind: 21, sortText: '90', detail: 'System Variable' },
      { label: '!quiet', kind: 21, sortText: '90', detail: 'System Variable' },
      {
        label: '!version',
        kind: 21,
        sortText: '90',
        detail: 'System Variable',
      },
      {
        label: "ENVITask('InitializeENVINet5MultiModel')",
        insertText: "ENVITask('InitializeENVINet5MultiModel')",
        kind: 3,
        sortText: '03',
        detail: 'Function',
      },
      {
        label: "ENVITask('BuildLabelRasterFromClassification')",
        insertText: "ENVITask('BuildLabelRasterFromClassification')",
        kind: 3,
        sortText: '03',
        detail: 'Function',
      },
      {
        label: "ENVITask('ClassActivationToPixelROI')",
        insertText: "ENVITask('ClassActivationToPixelROI')",
        kind: 3,
        sortText: '03',
        detail: 'Function',
      },
      {
        label: "ENVITask('RandomizeTrainTensorFlowMaskModel')",
        insertText: "ENVITask('RandomizeTrainTensorFlowMaskModel')",
        kind: 3,
        sortText: '03',
        detail: 'Function',
      },
      {
        label: 'ENVIBoundingBoxSet()',
        insertText: 'ENVIBoundingBoxSet()',
        kind: 3,
        sortText: '03',
        detail: 'Function',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'ENVITensorFlowGridModel()',
        insertText: 'ENVITensorFlowGridModel()',
        kind: 3,
        sortText: '03',
        detail: 'Function',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'ENVITensorFlowModel()',
        insertText: 'ENVITensorFlowModel()',
        kind: 3,
        sortText: '03',
        detail: 'Function',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
    ];

    // verify results
    expect(expectedFound_1).toEqual(
      (
        await index.getAutoComplete(
          filepath,
          await readFile(filepath, 'utf-8'),
          position_1
        )
      ).slice(0, 50)
    );
    // define position
    const position_2: Position = { line: 7, character: 18 };

    // define expected token we extract
    const expectedFound_2: CompletionItem[] = [
      {
        label: 'InitializeENVINet5MultiModel',
        insertText: 'InitializeENVINet5MultiModel',
        kind: 5,
        sortText: '03',
        detail: 'ENVI Task',
      },
      {
        label: 'BuildLabelRasterFromClassification',
        insertText: 'BuildLabelRasterFromClassification',
        kind: 5,
        sortText: '03',
        detail: 'ENVI Task',
      },
      {
        label: 'ClassActivationToPixelROI',
        insertText: 'ClassActivationToPixelROI',
        kind: 5,
        sortText: '03',
        detail: 'ENVI Task',
      },
      {
        label: 'RandomizeTrainTensorFlowMaskModel',
        insertText: 'RandomizeTrainTensorFlowMaskModel',
        kind: 5,
        sortText: '03',
        detail: 'ENVI Task',
      },
      {
        label: 'BuildDeepLearningRaster',
        insertText: 'BuildDeepLearningRaster',
        kind: 5,
        sortText: '03',
        detail: 'ENVI Task',
      },
      {
        label: 'BuildLabelRasterFromROI',
        insertText: 'BuildLabelRasterFromROI',
        kind: 5,
        sortText: '03',
        detail: 'ENVI Task',
      },
      {
        label: 'BuildObjectDetectionRasterFromAnnotation',
        insertText: 'BuildObjectDetectionRasterFromAnnotation',
        kind: 5,
        sortText: '03',
        detail: 'ENVI Task',
      },
      {
        label: 'InitializeENVINet5Model',
        insertText: 'InitializeENVINet5Model',
        kind: 5,
        sortText: '03',
        detail: 'ENVI Task',
      },
      {
        label: 'BuildObjectDetectionRasterFromROI',
        insertText: 'BuildObjectDetectionRasterFromROI',
        kind: 5,
        sortText: '03',
        detail: 'ENVI Task',
      },
      {
        label: 'BuildObjectDetectionRasterFromVector',
        insertText: 'BuildObjectDetectionRasterFromVector',
        kind: 5,
        sortText: '03',
        detail: 'ENVI Task',
      },
      {
        label: 'ClassActivationToClassification',
        insertText: 'ClassActivationToClassification',
        kind: 5,
        sortText: '03',
        detail: 'ENVI Task',
      },
      {
        label: 'ClassActivationToPolygonROI',
        insertText: 'ClassActivationToPolygonROI',
        kind: 5,
        sortText: '03',
        detail: 'ENVI Task',
      },
      {
        label: 'SubsetLabelRaster',
        insertText: 'SubsetLabelRaster',
        kind: 5,
        sortText: '03',
        detail: 'ENVI Task',
      },
      {
        label: 'ClassActivationToPolygonShapefile',
        insertText: 'ClassActivationToPolygonShapefile',
        kind: 5,
        sortText: '03',
        detail: 'ENVI Task',
      },
      {
        label: 'ClassActivationToPolylineShapefile',
        insertText: 'ClassActivationToPolylineShapefile',
        kind: 5,
        sortText: '03',
        detail: 'ENVI Task',
      },
      {
        label: 'TensorFlowMaskClassification',
        insertText: 'TensorFlowMaskClassification',
        kind: 5,
        sortText: '03',
        detail: 'ENVI Task',
      },
      {
        label: 'TrainTensorFlowGridModel',
        insertText: 'TrainTensorFlowGridModel',
        kind: 5,
        sortText: '03',
        detail: 'ENVI Task',
      },
      {
        label: 'ExtractDeepLearningLabelRasterFromFile',
        insertText: 'ExtractDeepLearningLabelRasterFromFile',
        kind: 5,
        sortText: '03',
        detail: 'ENVI Task',
      },
      {
        label: 'ExtractDeepLearningRasterFromFile',
        insertText: 'ExtractDeepLearningRasterFromFile',
        kind: 5,
        sortText: '03',
        detail: 'ENVI Task',
      },
      {
        label: 'ExtractTensorFlowModelFromFile',
        insertText: 'ExtractTensorFlowModelFromFile',
        kind: 5,
        sortText: '03',
        detail: 'ENVI Task',
      },
      {
        label: 'PostProcessObjectClassification',
        insertText: 'PostProcessObjectClassification',
        kind: 5,
        sortText: '03',
        detail: 'ENVI Task',
      },
      {
        label: 'TensorFlowGridClassification',
        insertText: 'TensorFlowGridClassification',
        kind: 5,
        sortText: '03',
        detail: 'ENVI Task',
      },
      {
        label: 'RandomizeTrainTensorFlowPixelModel',
        insertText: 'RandomizeTrainTensorFlowPixelModel',
        kind: 5,
        sortText: '03',
        detail: 'ENVI Task',
      },
      {
        label: 'TensorFlowObjectClassification',
        insertText: 'TensorFlowObjectClassification',
        kind: 5,
        sortText: '03',
        detail: 'ENVI Task',
      },
      {
        label: 'TensorFlowOptimizedObjectClassification',
        insertText: 'TensorFlowOptimizedObjectClassification',
        kind: 5,
        sortText: '03',
        detail: 'ENVI Task',
      },
      {
        label: 'TensorFlowOptimizedPixelClassification',
        insertText: 'TensorFlowOptimizedPixelClassification',
        kind: 5,
        sortText: '03',
        detail: 'ENVI Task',
      },
      {
        label: 'TensorFlowPixelClassification',
        insertText: 'TensorFlowPixelClassification',
        kind: 5,
        sortText: '03',
        detail: 'ENVI Task',
      },
      {
        label: 'TrainTensorFlowMaskModel',
        insertText: 'TrainTensorFlowMaskModel',
        kind: 5,
        sortText: '03',
        detail: 'ENVI Task',
      },
      {
        label: 'TrainTensorFlowObjectModel',
        insertText: 'TrainTensorFlowObjectModel',
        kind: 5,
        sortText: '03',
        detail: 'ENVI Task',
      },
      {
        label: 'TrainTensorFlowPixelModel',
        insertText: 'TrainTensorFlowPixelModel',
        kind: 5,
        sortText: '03',
        detail: 'ENVI Task',
      },
      {
        label: 'ImageToImageRegistration',
        insertText: 'ImageToImageRegistration',
        kind: 5,
        sortText: '03',
        detail: 'ENVI Task',
      },
      {
        label: 'DiceRasterByVector',
        insertText: 'DiceRasterByVector',
        kind: 5,
        sortText: '03',
        detail: 'ENVI Task',
      },
      {
        label: 'ConvertGeographicToMapCoordinates',
        insertText: 'ConvertGeographicToMapCoordinates',
        kind: 5,
        sortText: '03',
        detail: 'ENVI Task',
      },
      {
        label: 'LinearSpectralUnmixing',
        insertText: 'LinearSpectralUnmixing',
        kind: 5,
        sortText: '03',
        detail: 'ENVI Task',
      },
      {
        label: 'VectorRecordsToBoundingBox',
        insertText: 'VectorRecordsToBoundingBox',
        kind: 5,
        sortText: '03',
        detail: 'ENVI Task',
      },
      {
        label: 'MaximumLikelihoodClassification',
        insertText: 'MaximumLikelihoodClassification',
        kind: 5,
        sortText: '03',
        detail: 'ENVI Task',
      },
      {
        label: 'VectorRecordsToROI',
        insertText: 'VectorRecordsToROI',
        kind: 5,
        sortText: '03',
        detail: 'ENVI Task',
      },
      {
        label: 'FireFuelClassification',
        insertText: 'FireFuelClassification',
        kind: 5,
        sortText: '03',
        detail: 'ENVI Task',
      },
      {
        label: 'FilterTiePointsByFundamentalMatrix',
        insertText: 'FilterTiePointsByFundamentalMatrix',
        kind: 5,
        sortText: '03',
        detail: 'ENVI Task',
      },
      {
        label: 'MedianFilter',
        insertText: 'MedianFilter',
        kind: 5,
        sortText: '03',
        detail: 'ENVI Task',
      },
      {
        label: 'AgCalculateAndRasterizeCropMetricsWithSpectralIndex',
        insertText: 'AgCalculateAndRasterizeCropMetricsWithSpectralIndex',
        kind: 5,
        sortText: '03',
        detail: 'ENVI Task',
      },
      {
        label: 'CreateSubrectsFromTileCount',
        insertText: 'CreateSubrectsFromTileCount',
        kind: 5,
        sortText: '03',
        detail: 'ENVI Task',
      },
      {
        label: 'NNDiffusePanSharpening',
        insertText: 'NNDiffusePanSharpening',
        kind: 5,
        sortText: '03',
        detail: 'ENVI Task',
      },
      {
        label: 'ImageIntersection',
        insertText: 'ImageIntersection',
        kind: 5,
        sortText: '03',
        detail: 'ENVI Task',
      },
      {
        label: 'AutoChangeThresholdClassification',
        insertText: 'AutoChangeThresholdClassification',
        kind: 5,
        sortText: '03',
        detail: 'ENVI Task',
      },
      {
        label: 'VectorRecordsToSeparateROI',
        insertText: 'VectorRecordsToSeparateROI',
        kind: 5,
        sortText: '03',
        detail: 'ENVI Task',
      },
      {
        label: 'CreateSubrectsFromDistance',
        insertText: 'CreateSubrectsFromDistance',
        kind: 5,
        sortText: '03',
        detail: 'ENVI Task',
      },
      {
        label: 'LabelEntropyTexture',
        insertText: 'LabelEntropyTexture',
        kind: 5,
        sortText: '03',
        detail: 'ENVI Task',
      },
      {
        label: 'GenerateGCPsFromTiePoints',
        insertText: 'GenerateGCPsFromTiePoints',
        kind: 5,
        sortText: '03',
        detail: 'ENVI Task',
      },
      {
        label: 'AgFindDevelopingHotspots',
        insertText: 'AgFindDevelopingHotspots',
        kind: 5,
        sortText: '03',
        detail: 'ENVI Task',
      },
    ];

    // verify results
    expect(expectedFound_2).toEqual(
      (
        await index.getAutoComplete(
          filepath,
          await readFile(filepath, 'utf-8'),
          position_2
        )
      ).slice(0, 50)
    );
    // define position
    const position_3: Position = { line: 8, character: 17 };

    // define expected token we extract
    const expectedFound_3: CompletionItem[] = [];

    // verify results
    expect(expectedFound_3).toEqual(
      (
        await index.getAutoComplete(
          filepath,
          await readFile(filepath, 'utf-8'),
          position_3
        )
      ).slice(0, 50)
    );
    // define position
    const position_4: Position = { line: 11, character: 18 };

    // define expected token we extract
    const expectedFound_4: CompletionItem[] = [
      {
        label: 'InitializeENVINet5MultiModel',
        insertText: 'InitializeENVINet5MultiModel',
        kind: 5,
        sortText: '03',
        detail: 'ENVI Task',
      },
      {
        label: 'BuildLabelRasterFromClassification',
        insertText: 'BuildLabelRasterFromClassification',
        kind: 5,
        sortText: '03',
        detail: 'ENVI Task',
      },
      {
        label: 'ClassActivationToPixelROI',
        insertText: 'ClassActivationToPixelROI',
        kind: 5,
        sortText: '03',
        detail: 'ENVI Task',
      },
      {
        label: 'RandomizeTrainTensorFlowMaskModel',
        insertText: 'RandomizeTrainTensorFlowMaskModel',
        kind: 5,
        sortText: '03',
        detail: 'ENVI Task',
      },
      {
        label: 'BuildDeepLearningRaster',
        insertText: 'BuildDeepLearningRaster',
        kind: 5,
        sortText: '03',
        detail: 'ENVI Task',
      },
      {
        label: 'BuildLabelRasterFromROI',
        insertText: 'BuildLabelRasterFromROI',
        kind: 5,
        sortText: '03',
        detail: 'ENVI Task',
      },
      {
        label: 'BuildObjectDetectionRasterFromAnnotation',
        insertText: 'BuildObjectDetectionRasterFromAnnotation',
        kind: 5,
        sortText: '03',
        detail: 'ENVI Task',
      },
      {
        label: 'InitializeENVINet5Model',
        insertText: 'InitializeENVINet5Model',
        kind: 5,
        sortText: '03',
        detail: 'ENVI Task',
      },
      {
        label: 'BuildObjectDetectionRasterFromROI',
        insertText: 'BuildObjectDetectionRasterFromROI',
        kind: 5,
        sortText: '03',
        detail: 'ENVI Task',
      },
      {
        label: 'BuildObjectDetectionRasterFromVector',
        insertText: 'BuildObjectDetectionRasterFromVector',
        kind: 5,
        sortText: '03',
        detail: 'ENVI Task',
      },
      {
        label: 'ClassActivationToClassification',
        insertText: 'ClassActivationToClassification',
        kind: 5,
        sortText: '03',
        detail: 'ENVI Task',
      },
      {
        label: 'ClassActivationToPolygonROI',
        insertText: 'ClassActivationToPolygonROI',
        kind: 5,
        sortText: '03',
        detail: 'ENVI Task',
      },
      {
        label: 'SubsetLabelRaster',
        insertText: 'SubsetLabelRaster',
        kind: 5,
        sortText: '03',
        detail: 'ENVI Task',
      },
      {
        label: 'ClassActivationToPolygonShapefile',
        insertText: 'ClassActivationToPolygonShapefile',
        kind: 5,
        sortText: '03',
        detail: 'ENVI Task',
      },
      {
        label: 'ClassActivationToPolylineShapefile',
        insertText: 'ClassActivationToPolylineShapefile',
        kind: 5,
        sortText: '03',
        detail: 'ENVI Task',
      },
      {
        label: 'TensorFlowMaskClassification',
        insertText: 'TensorFlowMaskClassification',
        kind: 5,
        sortText: '03',
        detail: 'ENVI Task',
      },
      {
        label: 'TrainTensorFlowGridModel',
        insertText: 'TrainTensorFlowGridModel',
        kind: 5,
        sortText: '03',
        detail: 'ENVI Task',
      },
      {
        label: 'ExtractDeepLearningLabelRasterFromFile',
        insertText: 'ExtractDeepLearningLabelRasterFromFile',
        kind: 5,
        sortText: '03',
        detail: 'ENVI Task',
      },
      {
        label: 'ExtractDeepLearningRasterFromFile',
        insertText: 'ExtractDeepLearningRasterFromFile',
        kind: 5,
        sortText: '03',
        detail: 'ENVI Task',
      },
      {
        label: 'ExtractTensorFlowModelFromFile',
        insertText: 'ExtractTensorFlowModelFromFile',
        kind: 5,
        sortText: '03',
        detail: 'ENVI Task',
      },
      {
        label: 'PostProcessObjectClassification',
        insertText: 'PostProcessObjectClassification',
        kind: 5,
        sortText: '03',
        detail: 'ENVI Task',
      },
      {
        label: 'TensorFlowGridClassification',
        insertText: 'TensorFlowGridClassification',
        kind: 5,
        sortText: '03',
        detail: 'ENVI Task',
      },
      {
        label: 'RandomizeTrainTensorFlowPixelModel',
        insertText: 'RandomizeTrainTensorFlowPixelModel',
        kind: 5,
        sortText: '03',
        detail: 'ENVI Task',
      },
      {
        label: 'TensorFlowObjectClassification',
        insertText: 'TensorFlowObjectClassification',
        kind: 5,
        sortText: '03',
        detail: 'ENVI Task',
      },
      {
        label: 'TensorFlowOptimizedObjectClassification',
        insertText: 'TensorFlowOptimizedObjectClassification',
        kind: 5,
        sortText: '03',
        detail: 'ENVI Task',
      },
      {
        label: 'TensorFlowOptimizedPixelClassification',
        insertText: 'TensorFlowOptimizedPixelClassification',
        kind: 5,
        sortText: '03',
        detail: 'ENVI Task',
      },
      {
        label: 'TensorFlowPixelClassification',
        insertText: 'TensorFlowPixelClassification',
        kind: 5,
        sortText: '03',
        detail: 'ENVI Task',
      },
      {
        label: 'TrainTensorFlowMaskModel',
        insertText: 'TrainTensorFlowMaskModel',
        kind: 5,
        sortText: '03',
        detail: 'ENVI Task',
      },
      {
        label: 'TrainTensorFlowObjectModel',
        insertText: 'TrainTensorFlowObjectModel',
        kind: 5,
        sortText: '03',
        detail: 'ENVI Task',
      },
      {
        label: 'TrainTensorFlowPixelModel',
        insertText: 'TrainTensorFlowPixelModel',
        kind: 5,
        sortText: '03',
        detail: 'ENVI Task',
      },
      {
        label: 'ImageToImageRegistration',
        insertText: 'ImageToImageRegistration',
        kind: 5,
        sortText: '03',
        detail: 'ENVI Task',
      },
      {
        label: 'DiceRasterByVector',
        insertText: 'DiceRasterByVector',
        kind: 5,
        sortText: '03',
        detail: 'ENVI Task',
      },
      {
        label: 'ConvertGeographicToMapCoordinates',
        insertText: 'ConvertGeographicToMapCoordinates',
        kind: 5,
        sortText: '03',
        detail: 'ENVI Task',
      },
      {
        label: 'LinearSpectralUnmixing',
        insertText: 'LinearSpectralUnmixing',
        kind: 5,
        sortText: '03',
        detail: 'ENVI Task',
      },
      {
        label: 'VectorRecordsToBoundingBox',
        insertText: 'VectorRecordsToBoundingBox',
        kind: 5,
        sortText: '03',
        detail: 'ENVI Task',
      },
      {
        label: 'MaximumLikelihoodClassification',
        insertText: 'MaximumLikelihoodClassification',
        kind: 5,
        sortText: '03',
        detail: 'ENVI Task',
      },
      {
        label: 'VectorRecordsToROI',
        insertText: 'VectorRecordsToROI',
        kind: 5,
        sortText: '03',
        detail: 'ENVI Task',
      },
      {
        label: 'FireFuelClassification',
        insertText: 'FireFuelClassification',
        kind: 5,
        sortText: '03',
        detail: 'ENVI Task',
      },
      {
        label: 'FilterTiePointsByFundamentalMatrix',
        insertText: 'FilterTiePointsByFundamentalMatrix',
        kind: 5,
        sortText: '03',
        detail: 'ENVI Task',
      },
      {
        label: 'MedianFilter',
        insertText: 'MedianFilter',
        kind: 5,
        sortText: '03',
        detail: 'ENVI Task',
      },
      {
        label: 'AgCalculateAndRasterizeCropMetricsWithSpectralIndex',
        insertText: 'AgCalculateAndRasterizeCropMetricsWithSpectralIndex',
        kind: 5,
        sortText: '03',
        detail: 'ENVI Task',
      },
      {
        label: 'CreateSubrectsFromTileCount',
        insertText: 'CreateSubrectsFromTileCount',
        kind: 5,
        sortText: '03',
        detail: 'ENVI Task',
      },
      {
        label: 'NNDiffusePanSharpening',
        insertText: 'NNDiffusePanSharpening',
        kind: 5,
        sortText: '03',
        detail: 'ENVI Task',
      },
      {
        label: 'ImageIntersection',
        insertText: 'ImageIntersection',
        kind: 5,
        sortText: '03',
        detail: 'ENVI Task',
      },
      {
        label: 'AutoChangeThresholdClassification',
        insertText: 'AutoChangeThresholdClassification',
        kind: 5,
        sortText: '03',
        detail: 'ENVI Task',
      },
      {
        label: 'VectorRecordsToSeparateROI',
        insertText: 'VectorRecordsToSeparateROI',
        kind: 5,
        sortText: '03',
        detail: 'ENVI Task',
      },
      {
        label: 'CreateSubrectsFromDistance',
        insertText: 'CreateSubrectsFromDistance',
        kind: 5,
        sortText: '03',
        detail: 'ENVI Task',
      },
      {
        label: 'LabelEntropyTexture',
        insertText: 'LabelEntropyTexture',
        kind: 5,
        sortText: '03',
        detail: 'ENVI Task',
      },
      {
        label: 'GenerateGCPsFromTiePoints',
        insertText: 'GenerateGCPsFromTiePoints',
        kind: 5,
        sortText: '03',
        detail: 'ENVI Task',
      },
      {
        label: 'AgFindDevelopingHotspots',
        insertText: 'AgFindDevelopingHotspots',
        kind: 5,
        sortText: '03',
        detail: 'ENVI Task',
      },
    ];

    // verify results
    expect(expectedFound_4).toEqual(
      (
        await index.getAutoComplete(
          filepath,
          await readFile(filepath, 'utf-8'),
          position_4
        )
      ).slice(0, 50)
    );
    // define position
    const position_5: Position = { line: 12, character: 17 };

    // define expected token we extract
    const expectedFound_5: CompletionItem[] = [];

    // verify results
    expect(expectedFound_5).toEqual(
      (
        await index.getAutoComplete(
          filepath,
          await readFile(filepath, 'utf-8'),
          position_5
        )
      ).slice(0, 50)
    );
    // define position
    const position_6: Position = { line: 15, character: 18 };

    // define expected token we extract
    const expectedFound_6: CompletionItem[] = [
      {
        label: 'InitializeENVINet5MultiModel',
        insertText: 'InitializeENVINet5MultiModel',
        kind: 5,
        sortText: '03',
        detail: 'ENVI Task',
      },
      {
        label: 'BuildLabelRasterFromClassification',
        insertText: 'BuildLabelRasterFromClassification',
        kind: 5,
        sortText: '03',
        detail: 'ENVI Task',
      },
      {
        label: 'ClassActivationToPixelROI',
        insertText: 'ClassActivationToPixelROI',
        kind: 5,
        sortText: '03',
        detail: 'ENVI Task',
      },
      {
        label: 'RandomizeTrainTensorFlowMaskModel',
        insertText: 'RandomizeTrainTensorFlowMaskModel',
        kind: 5,
        sortText: '03',
        detail: 'ENVI Task',
      },
      {
        label: 'BuildDeepLearningRaster',
        insertText: 'BuildDeepLearningRaster',
        kind: 5,
        sortText: '03',
        detail: 'ENVI Task',
      },
      {
        label: 'BuildLabelRasterFromROI',
        insertText: 'BuildLabelRasterFromROI',
        kind: 5,
        sortText: '03',
        detail: 'ENVI Task',
      },
      {
        label: 'BuildObjectDetectionRasterFromAnnotation',
        insertText: 'BuildObjectDetectionRasterFromAnnotation',
        kind: 5,
        sortText: '03',
        detail: 'ENVI Task',
      },
      {
        label: 'InitializeENVINet5Model',
        insertText: 'InitializeENVINet5Model',
        kind: 5,
        sortText: '03',
        detail: 'ENVI Task',
      },
      {
        label: 'BuildObjectDetectionRasterFromROI',
        insertText: 'BuildObjectDetectionRasterFromROI',
        kind: 5,
        sortText: '03',
        detail: 'ENVI Task',
      },
      {
        label: 'BuildObjectDetectionRasterFromVector',
        insertText: 'BuildObjectDetectionRasterFromVector',
        kind: 5,
        sortText: '03',
        detail: 'ENVI Task',
      },
      {
        label: 'ClassActivationToClassification',
        insertText: 'ClassActivationToClassification',
        kind: 5,
        sortText: '03',
        detail: 'ENVI Task',
      },
      {
        label: 'ClassActivationToPolygonROI',
        insertText: 'ClassActivationToPolygonROI',
        kind: 5,
        sortText: '03',
        detail: 'ENVI Task',
      },
      {
        label: 'SubsetLabelRaster',
        insertText: 'SubsetLabelRaster',
        kind: 5,
        sortText: '03',
        detail: 'ENVI Task',
      },
      {
        label: 'ClassActivationToPolygonShapefile',
        insertText: 'ClassActivationToPolygonShapefile',
        kind: 5,
        sortText: '03',
        detail: 'ENVI Task',
      },
      {
        label: 'ClassActivationToPolylineShapefile',
        insertText: 'ClassActivationToPolylineShapefile',
        kind: 5,
        sortText: '03',
        detail: 'ENVI Task',
      },
      {
        label: 'TensorFlowMaskClassification',
        insertText: 'TensorFlowMaskClassification',
        kind: 5,
        sortText: '03',
        detail: 'ENVI Task',
      },
      {
        label: 'TrainTensorFlowGridModel',
        insertText: 'TrainTensorFlowGridModel',
        kind: 5,
        sortText: '03',
        detail: 'ENVI Task',
      },
      {
        label: 'ExtractDeepLearningLabelRasterFromFile',
        insertText: 'ExtractDeepLearningLabelRasterFromFile',
        kind: 5,
        sortText: '03',
        detail: 'ENVI Task',
      },
      {
        label: 'ExtractDeepLearningRasterFromFile',
        insertText: 'ExtractDeepLearningRasterFromFile',
        kind: 5,
        sortText: '03',
        detail: 'ENVI Task',
      },
      {
        label: 'ExtractTensorFlowModelFromFile',
        insertText: 'ExtractTensorFlowModelFromFile',
        kind: 5,
        sortText: '03',
        detail: 'ENVI Task',
      },
      {
        label: 'PostProcessObjectClassification',
        insertText: 'PostProcessObjectClassification',
        kind: 5,
        sortText: '03',
        detail: 'ENVI Task',
      },
      {
        label: 'TensorFlowGridClassification',
        insertText: 'TensorFlowGridClassification',
        kind: 5,
        sortText: '03',
        detail: 'ENVI Task',
      },
      {
        label: 'RandomizeTrainTensorFlowPixelModel',
        insertText: 'RandomizeTrainTensorFlowPixelModel',
        kind: 5,
        sortText: '03',
        detail: 'ENVI Task',
      },
      {
        label: 'TensorFlowObjectClassification',
        insertText: 'TensorFlowObjectClassification',
        kind: 5,
        sortText: '03',
        detail: 'ENVI Task',
      },
      {
        label: 'TensorFlowOptimizedObjectClassification',
        insertText: 'TensorFlowOptimizedObjectClassification',
        kind: 5,
        sortText: '03',
        detail: 'ENVI Task',
      },
      {
        label: 'TensorFlowOptimizedPixelClassification',
        insertText: 'TensorFlowOptimizedPixelClassification',
        kind: 5,
        sortText: '03',
        detail: 'ENVI Task',
      },
      {
        label: 'TensorFlowPixelClassification',
        insertText: 'TensorFlowPixelClassification',
        kind: 5,
        sortText: '03',
        detail: 'ENVI Task',
      },
      {
        label: 'TrainTensorFlowMaskModel',
        insertText: 'TrainTensorFlowMaskModel',
        kind: 5,
        sortText: '03',
        detail: 'ENVI Task',
      },
      {
        label: 'TrainTensorFlowObjectModel',
        insertText: 'TrainTensorFlowObjectModel',
        kind: 5,
        sortText: '03',
        detail: 'ENVI Task',
      },
      {
        label: 'TrainTensorFlowPixelModel',
        insertText: 'TrainTensorFlowPixelModel',
        kind: 5,
        sortText: '03',
        detail: 'ENVI Task',
      },
      {
        label: 'ImageToImageRegistration',
        insertText: 'ImageToImageRegistration',
        kind: 5,
        sortText: '03',
        detail: 'ENVI Task',
      },
      {
        label: 'DiceRasterByVector',
        insertText: 'DiceRasterByVector',
        kind: 5,
        sortText: '03',
        detail: 'ENVI Task',
      },
      {
        label: 'ConvertGeographicToMapCoordinates',
        insertText: 'ConvertGeographicToMapCoordinates',
        kind: 5,
        sortText: '03',
        detail: 'ENVI Task',
      },
      {
        label: 'LinearSpectralUnmixing',
        insertText: 'LinearSpectralUnmixing',
        kind: 5,
        sortText: '03',
        detail: 'ENVI Task',
      },
      {
        label: 'VectorRecordsToBoundingBox',
        insertText: 'VectorRecordsToBoundingBox',
        kind: 5,
        sortText: '03',
        detail: 'ENVI Task',
      },
      {
        label: 'MaximumLikelihoodClassification',
        insertText: 'MaximumLikelihoodClassification',
        kind: 5,
        sortText: '03',
        detail: 'ENVI Task',
      },
      {
        label: 'VectorRecordsToROI',
        insertText: 'VectorRecordsToROI',
        kind: 5,
        sortText: '03',
        detail: 'ENVI Task',
      },
      {
        label: 'FireFuelClassification',
        insertText: 'FireFuelClassification',
        kind: 5,
        sortText: '03',
        detail: 'ENVI Task',
      },
      {
        label: 'FilterTiePointsByFundamentalMatrix',
        insertText: 'FilterTiePointsByFundamentalMatrix',
        kind: 5,
        sortText: '03',
        detail: 'ENVI Task',
      },
      {
        label: 'MedianFilter',
        insertText: 'MedianFilter',
        kind: 5,
        sortText: '03',
        detail: 'ENVI Task',
      },
      {
        label: 'AgCalculateAndRasterizeCropMetricsWithSpectralIndex',
        insertText: 'AgCalculateAndRasterizeCropMetricsWithSpectralIndex',
        kind: 5,
        sortText: '03',
        detail: 'ENVI Task',
      },
      {
        label: 'CreateSubrectsFromTileCount',
        insertText: 'CreateSubrectsFromTileCount',
        kind: 5,
        sortText: '03',
        detail: 'ENVI Task',
      },
      {
        label: 'NNDiffusePanSharpening',
        insertText: 'NNDiffusePanSharpening',
        kind: 5,
        sortText: '03',
        detail: 'ENVI Task',
      },
      {
        label: 'ImageIntersection',
        insertText: 'ImageIntersection',
        kind: 5,
        sortText: '03',
        detail: 'ENVI Task',
      },
      {
        label: 'AutoChangeThresholdClassification',
        insertText: 'AutoChangeThresholdClassification',
        kind: 5,
        sortText: '03',
        detail: 'ENVI Task',
      },
      {
        label: 'VectorRecordsToSeparateROI',
        insertText: 'VectorRecordsToSeparateROI',
        kind: 5,
        sortText: '03',
        detail: 'ENVI Task',
      },
      {
        label: 'CreateSubrectsFromDistance',
        insertText: 'CreateSubrectsFromDistance',
        kind: 5,
        sortText: '03',
        detail: 'ENVI Task',
      },
      {
        label: 'LabelEntropyTexture',
        insertText: 'LabelEntropyTexture',
        kind: 5,
        sortText: '03',
        detail: 'ENVI Task',
      },
      {
        label: 'GenerateGCPsFromTiePoints',
        insertText: 'GenerateGCPsFromTiePoints',
        kind: 5,
        sortText: '03',
        detail: 'ENVI Task',
      },
      {
        label: 'AgFindDevelopingHotspots',
        insertText: 'AgFindDevelopingHotspots',
        kind: 5,
        sortText: '03',
        detail: 'ENVI Task',
      },
    ];

    // verify results
    expect(expectedFound_6).toEqual(
      (
        await index.getAutoComplete(
          filepath,
          await readFile(filepath, 'utf-8'),
          position_6
        )
      ).slice(0, 50)
    );
    // define position
    const position_7: Position = { line: 16, character: 17 };

    // define expected token we extract
    const expectedFound_7: CompletionItem[] = [];

    // verify results
    expect(expectedFound_7).toEqual(
      (
        await index.getAutoComplete(
          filepath,
          await readFile(filepath, 'utf-8'),
          position_7
        )
      ).slice(0, 50)
    );
  });
});
