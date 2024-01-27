import { LogManager } from '@idl/logger';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { GetExtensionPath } from '@idl/shared';
import { readFile } from 'fs/promises';
import { CompletionItem, Position } from 'vscode-languageserver/node';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] Add names of functions that we can auto-complete`, () => {
  it(`[auto generated] for all cases`, async () => {
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
      'idl/test/auto-complete/call_function.pro'
    );

    // add file to index
    await index.indexFile(filepath);

    // define position
    const position_0: Position = { line: 3, character: 22 };

    // define expected token we extract
    const expectedFound_0: CompletionItem[] = [
      {
        label: '_extra = ',
        insertText: '_extra = ',
        kind: 20,
        sortText: '00',
        detail: 'Keyword',
        documentation: {
          kind: 'markdown',
          value: 'Support for additional keywords',
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
    const position_1: Position = { line: 6, character: 23 };

    // define expected token we extract
    const expectedFound_1: CompletionItem[] = [
      {
        label: 'ENVIInitializeENVINet5MultiModelTask()',
        insertText: 'ENVIInitializeENVINet5MultiModelTask',
        kind: 3,
        sortText: '03',
        detail: 'Function',
      },
      {
        label: 'ENVIBuildLabelRasterFromClassificationTask()',
        insertText: 'ENVIBuildLabelRasterFromClassificationTask',
        kind: 3,
        sortText: '03',
        detail: 'Function',
      },
      {
        label: 'ENVIClassActivationToPixelROITask()',
        insertText: 'ENVIClassActivationToPixelROITask',
        kind: 3,
        sortText: '03',
        detail: 'Function',
      },
      {
        label: 'ENVIRandomizeTrainTensorFlowMaskModelTask()',
        insertText: 'ENVIRandomizeTrainTensorFlowMaskModelTask',
        kind: 3,
        sortText: '03',
        detail: 'Function',
      },
      {
        label: 'ENVIBoundingBoxSet()',
        insertText: 'ENVIBoundingBoxSet',
        kind: 3,
        sortText: '03',
        detail: 'Function',
      },
      {
        label: 'ENVITensorFlowGridModel()',
        insertText: 'ENVITensorFlowGridModel',
        kind: 3,
        sortText: '03',
        detail: 'Function',
      },
      {
        label: 'ENVITensorFlowModel()',
        insertText: 'ENVITensorFlowModel',
        kind: 3,
        sortText: '03',
        detail: 'Function',
      },
      {
        label: 'ENVIBuildDeepLearningRasterTask()',
        insertText: 'ENVIBuildDeepLearningRasterTask',
        kind: 3,
        sortText: '03',
        detail: 'Function',
      },
      {
        label: 'ENVIBuildLabelRasterFromROITask()',
        insertText: 'ENVIBuildLabelRasterFromROITask',
        kind: 3,
        sortText: '03',
        detail: 'Function',
      },
      {
        label: 'ENVIBuildObjectDetectionRasterFromAnnotationTask()',
        insertText: 'ENVIBuildObjectDetectionRasterFromAnnotationTask',
        kind: 3,
        sortText: '03',
        detail: 'Function',
      },
      {
        label: 'ENVIInitializeENVINet5ModelTask()',
        insertText: 'ENVIInitializeENVINet5ModelTask',
        kind: 3,
        sortText: '03',
        detail: 'Function',
      },
      {
        label: 'ENVIBuildObjectDetectionRasterFromROITask()',
        insertText: 'ENVIBuildObjectDetectionRasterFromROITask',
        kind: 3,
        sortText: '03',
        detail: 'Function',
      },
      {
        label: 'ENVIBuildObjectDetectionRasterFromVectorTask()',
        insertText: 'ENVIBuildObjectDetectionRasterFromVectorTask',
        kind: 3,
        sortText: '03',
        detail: 'Function',
      },
      {
        label: 'ENVIClassActivationToClassificationTask()',
        insertText: 'ENVIClassActivationToClassificationTask',
        kind: 3,
        sortText: '03',
        detail: 'Function',
      },
      {
        label: 'ENVIClassActivationToPolygonROITask()',
        insertText: 'ENVIClassActivationToPolygonROITask',
        kind: 3,
        sortText: '03',
        detail: 'Function',
      },
      {
        label: 'ENVISubsetLabelRasterTask()',
        insertText: 'ENVISubsetLabelRasterTask',
        kind: 3,
        sortText: '03',
        detail: 'Function',
      },
      {
        label: 'ENVIClassActivationToPolygonShapefileTask()',
        insertText: 'ENVIClassActivationToPolygonShapefileTask',
        kind: 3,
        sortText: '03',
        detail: 'Function',
      },
      {
        label: 'ENVIClassActivationToPolylineShapefileTask()',
        insertText: 'ENVIClassActivationToPolylineShapefileTask',
        kind: 3,
        sortText: '03',
        detail: 'Function',
      },
      {
        label: 'ENVIDeepLearningGeoJSONToROI()',
        insertText: 'ENVIDeepLearningGeoJSONToROI',
        kind: 3,
        sortText: '03',
        detail: 'Function',
      },
      {
        label: 'ENVIDeepLearningLabelRaster()',
        insertText: 'ENVIDeepLearningLabelRaster',
        kind: 3,
        sortText: '03',
        detail: 'Function',
      },
      {
        label: 'ENVIDeepLearningObjectDetectionRaster()',
        insertText: 'ENVIDeepLearningObjectDetectionRaster',
        kind: 3,
        sortText: '03',
        detail: 'Function',
      },
      {
        label: 'ENVIDeepLearningROIToGeoJSON()',
        insertText: 'ENVIDeepLearningROIToGeoJSON',
        kind: 3,
        sortText: '03',
        detail: 'Function',
      },
      {
        label: 'ENVITensorFlowMaskClassificationTask()',
        insertText: 'ENVITensorFlowMaskClassificationTask',
        kind: 3,
        sortText: '03',
        detail: 'Function',
      },
      {
        label: 'ENVIDeepLearningRaster()',
        insertText: 'ENVIDeepLearningRaster',
        kind: 3,
        sortText: '03',
        detail: 'Function',
      },
      {
        label: 'ENVITrainTensorFlowGridModelTask()',
        insertText: 'ENVITrainTensorFlowGridModelTask',
        kind: 3,
        sortText: '03',
        detail: 'Function',
      },
      {
        label: 'ENVIExtractDeepLearningLabelRasterFromFileTask()',
        insertText: 'ENVIExtractDeepLearningLabelRasterFromFileTask',
        kind: 3,
        sortText: '03',
        detail: 'Function',
      },
      {
        label: 'ENVIExtractDeepLearningRasterFromFileTask()',
        insertText: 'ENVIExtractDeepLearningRasterFromFileTask',
        kind: 3,
        sortText: '03',
        detail: 'Function',
      },
      {
        label: 'ENVIExtractTensorFlowModelFromFileTask()',
        insertText: 'ENVIExtractTensorFlowModelFromFileTask',
        kind: 3,
        sortText: '03',
        detail: 'Function',
      },
      {
        label: 'return()',
        insertText: 'return',
        kind: 3,
        sortText: '03',
        detail: 'Function',
      },
      {
        label: 'ENVIPostProcessObjectClassificationTask()',
        insertText: 'ENVIPostProcessObjectClassificationTask',
        kind: 3,
        sortText: '03',
        detail: 'Function',
      },
      {
        label: 'ENVITensorFlowGridClassificationTask()',
        insertText: 'ENVITensorFlowGridClassificationTask',
        kind: 3,
        sortText: '03',
        detail: 'Function',
      },
      {
        label: 'ENVIRandomizeTrainTensorFlowPixelModelTask()',
        insertText: 'ENVIRandomizeTrainTensorFlowPixelModelTask',
        kind: 3,
        sortText: '03',
        detail: 'Function',
      },
      {
        label: 'ENVITensorFlowObjectClassificationTask()',
        insertText: 'ENVITensorFlowObjectClassificationTask',
        kind: 3,
        sortText: '03',
        detail: 'Function',
      },
      {
        label: 'ENVITensorFlowObjectModel()',
        insertText: 'ENVITensorFlowObjectModel',
        kind: 3,
        sortText: '03',
        detail: 'Function',
      },
      {
        label: 'ENVITensorFlowOptimizedObjectClassificationTask()',
        insertText: 'ENVITensorFlowOptimizedObjectClassificationTask',
        kind: 3,
        sortText: '03',
        detail: 'Function',
      },
      {
        label: 'ENVITensorFlowOptimizedPixelClassificationTask()',
        insertText: 'ENVITensorFlowOptimizedPixelClassificationTask',
        kind: 3,
        sortText: '03',
        detail: 'Function',
      },
      {
        label: 'ENVITensorFlowPixelClassificationTask()',
        insertText: 'ENVITensorFlowPixelClassificationTask',
        kind: 3,
        sortText: '03',
        detail: 'Function',
      },
      {
        label: 'ENVITrainTensorFlowMaskModelTask()',
        insertText: 'ENVITrainTensorFlowMaskModelTask',
        kind: 3,
        sortText: '03',
        detail: 'Function',
      },
      {
        label: 'ENVITrainTensorFlowObjectModelTask()',
        insertText: 'ENVITrainTensorFlowObjectModelTask',
        kind: 3,
        sortText: '03',
        detail: 'Function',
      },
      {
        label: 'ENVITrainTensorFlowPixelModelTask()',
        insertText: 'ENVITrainTensorFlowPixelModelTask',
        kind: 3,
        sortText: '03',
        detail: 'Function',
      },
      {
        label: 'ENVIStretchParameters()',
        insertText: 'ENVIStretchParameters',
        kind: 3,
        sortText: '03',
        detail: 'Function',
      },
      {
        label: 'ENVIImageToImageRegistrationTask()',
        insertText: 'ENVIImageToImageRegistrationTask',
        kind: 3,
        sortText: '03',
        detail: 'Function',
      },
      {
        label: 'ENVIDiceRasterByVectorTask()',
        insertText: 'ENVIDiceRasterByVectorTask',
        kind: 3,
        sortText: '03',
        detail: 'Function',
      },
      {
        label: 'ENVIConvertGeographicToMapCoordinatesTask()',
        insertText: 'ENVIConvertGeographicToMapCoordinatesTask',
        kind: 3,
        sortText: '03',
        detail: 'Function',
      },
      {
        label: 'ENVITask()',
        insertText: 'ENVITask',
        kind: 3,
        sortText: '03',
        detail: 'Function',
      },
      {
        label: 'ENVIAbortable()',
        insertText: 'ENVIAbortable',
        kind: 3,
        sortText: '03',
        detail: 'Function',
      },
      {
        label: 'ENVILinearSpectralUnmixingTask()',
        insertText: 'ENVILinearSpectralUnmixingTask',
        kind: 3,
        sortText: '03',
        detail: 'Function',
      },
      {
        label: 'ENVIVectorRecordsToBoundingBoxTask()',
        insertText: 'ENVIVectorRecordsToBoundingBoxTask',
        kind: 3,
        sortText: '03',
        detail: 'Function',
      },
      {
        label: 'ENVIMaximumLikelihoodClassificationTask()',
        insertText: 'ENVIMaximumLikelihoodClassificationTask',
        kind: 3,
        sortText: '03',
        detail: 'Function',
      },
      {
        label: 'ENVIVectorRecordsToROITask()',
        insertText: 'ENVIVectorRecordsToROITask',
        kind: 3,
        sortText: '03',
        detail: 'Function',
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
    const position_2: Position = { line: 10, character: 23 };

    // define expected token we extract
    const expectedFound_2: CompletionItem[] = [
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
        label: 'ENVITensorBoard',
        kind: 3,
        sortText: '03',
        detail: 'Procedure',
      },
      { label: 'openr', kind: 3, sortText: '03', detail: 'Procedure' },
      { label: 'openu', kind: 3, sortText: '03', detail: 'Procedure' },
      { label: 'openw', kind: 3, sortText: '03', detail: 'Procedure' },
      { label: 'print', kind: 3, sortText: '03', detail: 'Procedure' },
      { label: 'printf', kind: 3, sortText: '03', detail: 'Procedure' },
      { label: 'read', kind: 3, sortText: '03', detail: 'Procedure' },
      { label: 'readf', kind: 3, sortText: '03', detail: 'Procedure' },
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
    const position_3: Position = { line: 12, character: 23 };

    // define expected token we extract
    const expectedFound_3: CompletionItem[] = [
      {
        label: 'ENVIInitializeENVINet5MultiModelTask()',
        insertText: 'ENVIInitializeENVINet5MultiModelTask',
        kind: 3,
        sortText: '03',
        detail: 'Function',
      },
      {
        label: 'ENVIBuildLabelRasterFromClassificationTask()',
        insertText: 'ENVIBuildLabelRasterFromClassificationTask',
        kind: 3,
        sortText: '03',
        detail: 'Function',
      },
      {
        label: 'ENVIClassActivationToPixelROITask()',
        insertText: 'ENVIClassActivationToPixelROITask',
        kind: 3,
        sortText: '03',
        detail: 'Function',
      },
      {
        label: 'ENVIRandomizeTrainTensorFlowMaskModelTask()',
        insertText: 'ENVIRandomizeTrainTensorFlowMaskModelTask',
        kind: 3,
        sortText: '03',
        detail: 'Function',
      },
      {
        label: 'ENVIBoundingBoxSet()',
        insertText: 'ENVIBoundingBoxSet',
        kind: 3,
        sortText: '03',
        detail: 'Function',
      },
      {
        label: 'ENVITensorFlowGridModel()',
        insertText: 'ENVITensorFlowGridModel',
        kind: 3,
        sortText: '03',
        detail: 'Function',
      },
      {
        label: 'ENVITensorFlowModel()',
        insertText: 'ENVITensorFlowModel',
        kind: 3,
        sortText: '03',
        detail: 'Function',
      },
      {
        label: 'ENVIBuildDeepLearningRasterTask()',
        insertText: 'ENVIBuildDeepLearningRasterTask',
        kind: 3,
        sortText: '03',
        detail: 'Function',
      },
      {
        label: 'ENVIBuildLabelRasterFromROITask()',
        insertText: 'ENVIBuildLabelRasterFromROITask',
        kind: 3,
        sortText: '03',
        detail: 'Function',
      },
      {
        label: 'ENVIBuildObjectDetectionRasterFromAnnotationTask()',
        insertText: 'ENVIBuildObjectDetectionRasterFromAnnotationTask',
        kind: 3,
        sortText: '03',
        detail: 'Function',
      },
      {
        label: 'ENVIInitializeENVINet5ModelTask()',
        insertText: 'ENVIInitializeENVINet5ModelTask',
        kind: 3,
        sortText: '03',
        detail: 'Function',
      },
      {
        label: 'ENVIBuildObjectDetectionRasterFromROITask()',
        insertText: 'ENVIBuildObjectDetectionRasterFromROITask',
        kind: 3,
        sortText: '03',
        detail: 'Function',
      },
      {
        label: 'ENVIBuildObjectDetectionRasterFromVectorTask()',
        insertText: 'ENVIBuildObjectDetectionRasterFromVectorTask',
        kind: 3,
        sortText: '03',
        detail: 'Function',
      },
      {
        label: 'ENVIClassActivationToClassificationTask()',
        insertText: 'ENVIClassActivationToClassificationTask',
        kind: 3,
        sortText: '03',
        detail: 'Function',
      },
      {
        label: 'ENVIClassActivationToPolygonROITask()',
        insertText: 'ENVIClassActivationToPolygonROITask',
        kind: 3,
        sortText: '03',
        detail: 'Function',
      },
      {
        label: 'ENVISubsetLabelRasterTask()',
        insertText: 'ENVISubsetLabelRasterTask',
        kind: 3,
        sortText: '03',
        detail: 'Function',
      },
      {
        label: 'ENVIClassActivationToPolygonShapefileTask()',
        insertText: 'ENVIClassActivationToPolygonShapefileTask',
        kind: 3,
        sortText: '03',
        detail: 'Function',
      },
      {
        label: 'ENVIClassActivationToPolylineShapefileTask()',
        insertText: 'ENVIClassActivationToPolylineShapefileTask',
        kind: 3,
        sortText: '03',
        detail: 'Function',
      },
      {
        label: 'ENVIDeepLearningGeoJSONToROI()',
        insertText: 'ENVIDeepLearningGeoJSONToROI',
        kind: 3,
        sortText: '03',
        detail: 'Function',
      },
      {
        label: 'ENVIDeepLearningLabelRaster()',
        insertText: 'ENVIDeepLearningLabelRaster',
        kind: 3,
        sortText: '03',
        detail: 'Function',
      },
      {
        label: 'ENVIDeepLearningObjectDetectionRaster()',
        insertText: 'ENVIDeepLearningObjectDetectionRaster',
        kind: 3,
        sortText: '03',
        detail: 'Function',
      },
      {
        label: 'ENVIDeepLearningROIToGeoJSON()',
        insertText: 'ENVIDeepLearningROIToGeoJSON',
        kind: 3,
        sortText: '03',
        detail: 'Function',
      },
      {
        label: 'ENVITensorFlowMaskClassificationTask()',
        insertText: 'ENVITensorFlowMaskClassificationTask',
        kind: 3,
        sortText: '03',
        detail: 'Function',
      },
      {
        label: 'ENVIDeepLearningRaster()',
        insertText: 'ENVIDeepLearningRaster',
        kind: 3,
        sortText: '03',
        detail: 'Function',
      },
      {
        label: 'ENVITrainTensorFlowGridModelTask()',
        insertText: 'ENVITrainTensorFlowGridModelTask',
        kind: 3,
        sortText: '03',
        detail: 'Function',
      },
      {
        label: 'ENVIExtractDeepLearningLabelRasterFromFileTask()',
        insertText: 'ENVIExtractDeepLearningLabelRasterFromFileTask',
        kind: 3,
        sortText: '03',
        detail: 'Function',
      },
      {
        label: 'ENVIExtractDeepLearningRasterFromFileTask()',
        insertText: 'ENVIExtractDeepLearningRasterFromFileTask',
        kind: 3,
        sortText: '03',
        detail: 'Function',
      },
      {
        label: 'ENVIExtractTensorFlowModelFromFileTask()',
        insertText: 'ENVIExtractTensorFlowModelFromFileTask',
        kind: 3,
        sortText: '03',
        detail: 'Function',
      },
      {
        label: 'return()',
        insertText: 'return',
        kind: 3,
        sortText: '03',
        detail: 'Function',
      },
      {
        label: 'ENVIPostProcessObjectClassificationTask()',
        insertText: 'ENVIPostProcessObjectClassificationTask',
        kind: 3,
        sortText: '03',
        detail: 'Function',
      },
      {
        label: 'ENVITensorFlowGridClassificationTask()',
        insertText: 'ENVITensorFlowGridClassificationTask',
        kind: 3,
        sortText: '03',
        detail: 'Function',
      },
      {
        label: 'ENVIRandomizeTrainTensorFlowPixelModelTask()',
        insertText: 'ENVIRandomizeTrainTensorFlowPixelModelTask',
        kind: 3,
        sortText: '03',
        detail: 'Function',
      },
      {
        label: 'ENVITensorFlowObjectClassificationTask()',
        insertText: 'ENVITensorFlowObjectClassificationTask',
        kind: 3,
        sortText: '03',
        detail: 'Function',
      },
      {
        label: 'ENVITensorFlowObjectModel()',
        insertText: 'ENVITensorFlowObjectModel',
        kind: 3,
        sortText: '03',
        detail: 'Function',
      },
      {
        label: 'ENVITensorFlowOptimizedObjectClassificationTask()',
        insertText: 'ENVITensorFlowOptimizedObjectClassificationTask',
        kind: 3,
        sortText: '03',
        detail: 'Function',
      },
      {
        label: 'ENVITensorFlowOptimizedPixelClassificationTask()',
        insertText: 'ENVITensorFlowOptimizedPixelClassificationTask',
        kind: 3,
        sortText: '03',
        detail: 'Function',
      },
      {
        label: 'ENVITensorFlowPixelClassificationTask()',
        insertText: 'ENVITensorFlowPixelClassificationTask',
        kind: 3,
        sortText: '03',
        detail: 'Function',
      },
      {
        label: 'ENVITrainTensorFlowMaskModelTask()',
        insertText: 'ENVITrainTensorFlowMaskModelTask',
        kind: 3,
        sortText: '03',
        detail: 'Function',
      },
      {
        label: 'ENVITrainTensorFlowObjectModelTask()',
        insertText: 'ENVITrainTensorFlowObjectModelTask',
        kind: 3,
        sortText: '03',
        detail: 'Function',
      },
      {
        label: 'ENVITrainTensorFlowPixelModelTask()',
        insertText: 'ENVITrainTensorFlowPixelModelTask',
        kind: 3,
        sortText: '03',
        detail: 'Function',
      },
      {
        label: 'ENVIStretchParameters()',
        insertText: 'ENVIStretchParameters',
        kind: 3,
        sortText: '03',
        detail: 'Function',
      },
      {
        label: 'ENVIImageToImageRegistrationTask()',
        insertText: 'ENVIImageToImageRegistrationTask',
        kind: 3,
        sortText: '03',
        detail: 'Function',
      },
      {
        label: 'ENVIDiceRasterByVectorTask()',
        insertText: 'ENVIDiceRasterByVectorTask',
        kind: 3,
        sortText: '03',
        detail: 'Function',
      },
      {
        label: 'ENVIConvertGeographicToMapCoordinatesTask()',
        insertText: 'ENVIConvertGeographicToMapCoordinatesTask',
        kind: 3,
        sortText: '03',
        detail: 'Function',
      },
      {
        label: 'ENVITask()',
        insertText: 'ENVITask',
        kind: 3,
        sortText: '03',
        detail: 'Function',
      },
      {
        label: 'ENVIAbortable()',
        insertText: 'ENVIAbortable',
        kind: 3,
        sortText: '03',
        detail: 'Function',
      },
      {
        label: 'ENVILinearSpectralUnmixingTask()',
        insertText: 'ENVILinearSpectralUnmixingTask',
        kind: 3,
        sortText: '03',
        detail: 'Function',
      },
      {
        label: 'ENVIVectorRecordsToBoundingBoxTask()',
        insertText: 'ENVIVectorRecordsToBoundingBoxTask',
        kind: 3,
        sortText: '03',
        detail: 'Function',
      },
      {
        label: 'ENVIMaximumLikelihoodClassificationTask()',
        insertText: 'ENVIMaximumLikelihoodClassificationTask',
        kind: 3,
        sortText: '03',
        detail: 'Function',
      },
      {
        label: 'ENVIVectorRecordsToROITask()',
        insertText: 'ENVIVectorRecordsToROITask',
        kind: 3,
        sortText: '03',
        detail: 'Function',
      },
    ];

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
  });
});
