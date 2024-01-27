import { LogManager } from '@idl/logger';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { GetExtensionPath } from '@idl/shared';
import { readFile } from 'fs/promises';
import { CompletionItem, Position } from 'vscode-languageserver/node';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] Add class names for obj_new`, () => {
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
    const filepath = GetExtensionPath('idl/test/auto-complete/obj_new.pro');

    // add file to index
    await index.indexFile(filepath);

    // define position
    const position_0: Position = { line: 59, character: 16 };

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
    const position_1: Position = { line: 62, character: 17 };

    // define expected token we extract
    const expectedFound_1: CompletionItem[] = [
      { label: '!x', kind: 7, sortText: '00', detail: 'Structure' },
      { label: '!y', kind: 7, sortText: '00', detail: 'Structure' },
      { label: '!z', kind: 7, sortText: '00', detail: 'Structure' },
      {
        label: 'ENVIInitializeENVINet5MultiModelTask',
        kind: 7,
        sortText: '00',
        detail: 'Structure',
      },
      {
        label: 'ENVIBuildLabelRasterFromClassificationTask',
        kind: 7,
        sortText: '00',
        detail: 'Structure',
      },
      {
        label: 'ENVIClassActivationToPixelROITask',
        kind: 7,
        sortText: '00',
        detail: 'Structure',
      },
      {
        label: 'ENVIRandomizeTrainTensorFlowMaskModelTask',
        kind: 7,
        sortText: '00',
        detail: 'Structure',
      },
      {
        label: 'ENVIBoundingBoxSet',
        kind: 7,
        sortText: '00',
        detail: 'Structure',
      },
      {
        label: 'ENVITensorFlowGridModel',
        kind: 7,
        sortText: '00',
        detail: 'Structure',
      },
      {
        label: 'ENVITensorFlowModel',
        kind: 7,
        sortText: '00',
        detail: 'Structure',
      },
      {
        label: 'ENVIBuildDeepLearningRasterTask',
        kind: 7,
        sortText: '00',
        detail: 'Structure',
      },
      {
        label: 'ENVIBuildLabelRasterFromROITask',
        kind: 7,
        sortText: '00',
        detail: 'Structure',
      },
      {
        label: 'ENVIBuildObjectDetectionRasterFromAnnotationTask',
        kind: 7,
        sortText: '00',
        detail: 'Structure',
      },
      {
        label: 'ENVIInitializeENVINet5ModelTask',
        kind: 7,
        sortText: '00',
        detail: 'Structure',
      },
      {
        label: 'ENVIBuildObjectDetectionRasterFromROITask',
        kind: 7,
        sortText: '00',
        detail: 'Structure',
      },
      {
        label: 'ENVIBuildObjectDetectionRasterFromVectorTask',
        kind: 7,
        sortText: '00',
        detail: 'Structure',
      },
      {
        label: 'ENVIClassActivationToClassificationTask',
        kind: 7,
        sortText: '00',
        detail: 'Structure',
      },
      {
        label: 'ENVIClassActivationToPolygonROITask',
        kind: 7,
        sortText: '00',
        detail: 'Structure',
      },
      {
        label: 'ENVISubsetLabelRasterTask',
        kind: 7,
        sortText: '00',
        detail: 'Structure',
      },
      {
        label: 'ENVIClassActivationToPolygonShapefileTask',
        kind: 7,
        sortText: '00',
        detail: 'Structure',
      },
      {
        label: 'ENVIClassActivationToPolylineShapefileTask',
        kind: 7,
        sortText: '00',
        detail: 'Structure',
      },
      {
        label: 'ENVIDeepLearningLabelRaster',
        kind: 7,
        sortText: '00',
        detail: 'Structure',
      },
      {
        label: 'ENVIDeepLearningObjectDetectionRaster',
        kind: 7,
        sortText: '00',
        detail: 'Structure',
      },
      {
        label: 'ENVITensorFlowMaskClassificationTask',
        kind: 7,
        sortText: '00',
        detail: 'Structure',
      },
      {
        label: 'ENVIDeepLearningRaster',
        kind: 7,
        sortText: '00',
        detail: 'Structure',
      },
      {
        label: 'ENVITrainTensorFlowGridModelTask',
        kind: 7,
        sortText: '00',
        detail: 'Structure',
      },
      {
        label: 'ENVIExtractDeepLearningLabelRasterFromFileTask',
        kind: 7,
        sortText: '00',
        detail: 'Structure',
      },
      {
        label: 'ENVIExtractDeepLearningRasterFromFileTask',
        kind: 7,
        sortText: '00',
        detail: 'Structure',
      },
      {
        label: 'ENVIExtractTensorFlowModelFromFileTask',
        kind: 7,
        sortText: '00',
        detail: 'Structure',
      },
      {
        label: 'ENVIPostProcessObjectClassificationTask',
        kind: 7,
        sortText: '00',
        detail: 'Structure',
      },
      {
        label: 'ENVITensorFlowGridClassificationTask',
        kind: 7,
        sortText: '00',
        detail: 'Structure',
      },
      {
        label: 'ENVIRandomizeTrainTensorFlowPixelModelTask',
        kind: 7,
        sortText: '00',
        detail: 'Structure',
      },
      {
        label: 'ENVITensorFlowObjectClassificationTask',
        kind: 7,
        sortText: '00',
        detail: 'Structure',
      },
      {
        label: 'ENVITensorFlowObjectModel',
        kind: 7,
        sortText: '00',
        detail: 'Structure',
      },
      {
        label: 'ENVITensorFlowOptimizedObjectClassificationTask',
        kind: 7,
        sortText: '00',
        detail: 'Structure',
      },
      {
        label: 'ENVITensorFlowOptimizedPixelClassificationTask',
        kind: 7,
        sortText: '00',
        detail: 'Structure',
      },
      {
        label: 'ENVITensorFlowPixelClassificationTask',
        kind: 7,
        sortText: '00',
        detail: 'Structure',
      },
      {
        label: 'ENVITrainTensorFlowMaskModelTask',
        kind: 7,
        sortText: '00',
        detail: 'Structure',
      },
      {
        label: 'ENVITrainTensorFlowObjectModelTask',
        kind: 7,
        sortText: '00',
        detail: 'Structure',
      },
      {
        label: 'ENVITrainTensorFlowPixelModelTask',
        kind: 7,
        sortText: '00',
        detail: 'Structure',
      },
      {
        label: 'ENVIStretchParameters',
        kind: 7,
        sortText: '00',
        detail: 'Structure',
      },
      {
        label: 'ENVIImageToImageRegistrationTask',
        kind: 7,
        sortText: '00',
        detail: 'Structure',
      },
      {
        label: 'ENVIDiceRasterByVectorTask',
        kind: 7,
        sortText: '00',
        detail: 'Structure',
      },
      {
        label: 'ENVIConvertGeographicToMapCoordinatesTask',
        kind: 7,
        sortText: '00',
        detail: 'Structure',
      },
      { label: 'ENVITask', kind: 7, sortText: '00', detail: 'Structure' },
      { label: 'ENVIAbortable', kind: 7, sortText: '00', detail: 'Structure' },
      {
        label: 'ENVILinearSpectralUnmixingTask',
        kind: 7,
        sortText: '00',
        detail: 'Structure',
      },
      {
        label: 'ENVIVectorRecordsToBoundingBoxTask',
        kind: 7,
        sortText: '00',
        detail: 'Structure',
      },
      {
        label: 'ENVIMaximumLikelihoodClassificationTask',
        kind: 7,
        sortText: '00',
        detail: 'Structure',
      },
      {
        label: 'ENVICalibrateRaster',
        kind: 7,
        sortText: '00',
        detail: 'Structure',
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
    const position_2: Position = { line: 65, character: 17 };

    // define expected token we extract
    const expectedFound_2: CompletionItem[] = [
      { label: '!x', kind: 7, sortText: '00', detail: 'Structure' },
      { label: '!y', kind: 7, sortText: '00', detail: 'Structure' },
      { label: '!z', kind: 7, sortText: '00', detail: 'Structure' },
      {
        label: 'ENVIInitializeENVINet5MultiModelTask',
        kind: 7,
        sortText: '00',
        detail: 'Structure',
      },
      {
        label: 'ENVIBuildLabelRasterFromClassificationTask',
        kind: 7,
        sortText: '00',
        detail: 'Structure',
      },
      {
        label: 'ENVIClassActivationToPixelROITask',
        kind: 7,
        sortText: '00',
        detail: 'Structure',
      },
      {
        label: 'ENVIRandomizeTrainTensorFlowMaskModelTask',
        kind: 7,
        sortText: '00',
        detail: 'Structure',
      },
      {
        label: 'ENVIBoundingBoxSet',
        kind: 7,
        sortText: '00',
        detail: 'Structure',
      },
      {
        label: 'ENVITensorFlowGridModel',
        kind: 7,
        sortText: '00',
        detail: 'Structure',
      },
      {
        label: 'ENVITensorFlowModel',
        kind: 7,
        sortText: '00',
        detail: 'Structure',
      },
      {
        label: 'ENVIBuildDeepLearningRasterTask',
        kind: 7,
        sortText: '00',
        detail: 'Structure',
      },
      {
        label: 'ENVIBuildLabelRasterFromROITask',
        kind: 7,
        sortText: '00',
        detail: 'Structure',
      },
      {
        label: 'ENVIBuildObjectDetectionRasterFromAnnotationTask',
        kind: 7,
        sortText: '00',
        detail: 'Structure',
      },
      {
        label: 'ENVIInitializeENVINet5ModelTask',
        kind: 7,
        sortText: '00',
        detail: 'Structure',
      },
      {
        label: 'ENVIBuildObjectDetectionRasterFromROITask',
        kind: 7,
        sortText: '00',
        detail: 'Structure',
      },
      {
        label: 'ENVIBuildObjectDetectionRasterFromVectorTask',
        kind: 7,
        sortText: '00',
        detail: 'Structure',
      },
      {
        label: 'ENVIClassActivationToClassificationTask',
        kind: 7,
        sortText: '00',
        detail: 'Structure',
      },
      {
        label: 'ENVIClassActivationToPolygonROITask',
        kind: 7,
        sortText: '00',
        detail: 'Structure',
      },
      {
        label: 'ENVISubsetLabelRasterTask',
        kind: 7,
        sortText: '00',
        detail: 'Structure',
      },
      {
        label: 'ENVIClassActivationToPolygonShapefileTask',
        kind: 7,
        sortText: '00',
        detail: 'Structure',
      },
      {
        label: 'ENVIClassActivationToPolylineShapefileTask',
        kind: 7,
        sortText: '00',
        detail: 'Structure',
      },
      {
        label: 'ENVIDeepLearningLabelRaster',
        kind: 7,
        sortText: '00',
        detail: 'Structure',
      },
      {
        label: 'ENVIDeepLearningObjectDetectionRaster',
        kind: 7,
        sortText: '00',
        detail: 'Structure',
      },
      {
        label: 'ENVITensorFlowMaskClassificationTask',
        kind: 7,
        sortText: '00',
        detail: 'Structure',
      },
      {
        label: 'ENVIDeepLearningRaster',
        kind: 7,
        sortText: '00',
        detail: 'Structure',
      },
      {
        label: 'ENVITrainTensorFlowGridModelTask',
        kind: 7,
        sortText: '00',
        detail: 'Structure',
      },
      {
        label: 'ENVIExtractDeepLearningLabelRasterFromFileTask',
        kind: 7,
        sortText: '00',
        detail: 'Structure',
      },
      {
        label: 'ENVIExtractDeepLearningRasterFromFileTask',
        kind: 7,
        sortText: '00',
        detail: 'Structure',
      },
      {
        label: 'ENVIExtractTensorFlowModelFromFileTask',
        kind: 7,
        sortText: '00',
        detail: 'Structure',
      },
      {
        label: 'ENVIPostProcessObjectClassificationTask',
        kind: 7,
        sortText: '00',
        detail: 'Structure',
      },
      {
        label: 'ENVITensorFlowGridClassificationTask',
        kind: 7,
        sortText: '00',
        detail: 'Structure',
      },
      {
        label: 'ENVIRandomizeTrainTensorFlowPixelModelTask',
        kind: 7,
        sortText: '00',
        detail: 'Structure',
      },
      {
        label: 'ENVITensorFlowObjectClassificationTask',
        kind: 7,
        sortText: '00',
        detail: 'Structure',
      },
      {
        label: 'ENVITensorFlowObjectModel',
        kind: 7,
        sortText: '00',
        detail: 'Structure',
      },
      {
        label: 'ENVITensorFlowOptimizedObjectClassificationTask',
        kind: 7,
        sortText: '00',
        detail: 'Structure',
      },
      {
        label: 'ENVITensorFlowOptimizedPixelClassificationTask',
        kind: 7,
        sortText: '00',
        detail: 'Structure',
      },
      {
        label: 'ENVITensorFlowPixelClassificationTask',
        kind: 7,
        sortText: '00',
        detail: 'Structure',
      },
      {
        label: 'ENVITrainTensorFlowMaskModelTask',
        kind: 7,
        sortText: '00',
        detail: 'Structure',
      },
      {
        label: 'ENVITrainTensorFlowObjectModelTask',
        kind: 7,
        sortText: '00',
        detail: 'Structure',
      },
      {
        label: 'ENVITrainTensorFlowPixelModelTask',
        kind: 7,
        sortText: '00',
        detail: 'Structure',
      },
      {
        label: 'ENVIStretchParameters',
        kind: 7,
        sortText: '00',
        detail: 'Structure',
      },
      {
        label: 'ENVIImageToImageRegistrationTask',
        kind: 7,
        sortText: '00',
        detail: 'Structure',
      },
      {
        label: 'ENVIDiceRasterByVectorTask',
        kind: 7,
        sortText: '00',
        detail: 'Structure',
      },
      {
        label: 'ENVIConvertGeographicToMapCoordinatesTask',
        kind: 7,
        sortText: '00',
        detail: 'Structure',
      },
      { label: 'ENVITask', kind: 7, sortText: '00', detail: 'Structure' },
      { label: 'ENVIAbortable', kind: 7, sortText: '00', detail: 'Structure' },
      {
        label: 'ENVILinearSpectralUnmixingTask',
        kind: 7,
        sortText: '00',
        detail: 'Structure',
      },
      {
        label: 'ENVIVectorRecordsToBoundingBoxTask',
        kind: 7,
        sortText: '00',
        detail: 'Structure',
      },
      {
        label: 'ENVIMaximumLikelihoodClassificationTask',
        kind: 7,
        sortText: '00',
        detail: 'Structure',
      },
      {
        label: 'ENVICalibrateRaster',
        kind: 7,
        sortText: '00',
        detail: 'Structure',
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
    const position_3: Position = { line: 68, character: 17 };

    // define expected token we extract
    const expectedFound_3: CompletionItem[] = [
      { label: '!x', kind: 7, sortText: '00', detail: 'Structure' },
      { label: '!y', kind: 7, sortText: '00', detail: 'Structure' },
      { label: '!z', kind: 7, sortText: '00', detail: 'Structure' },
      {
        label: 'ENVIInitializeENVINet5MultiModelTask',
        kind: 7,
        sortText: '00',
        detail: 'Structure',
      },
      {
        label: 'ENVIBuildLabelRasterFromClassificationTask',
        kind: 7,
        sortText: '00',
        detail: 'Structure',
      },
      {
        label: 'ENVIClassActivationToPixelROITask',
        kind: 7,
        sortText: '00',
        detail: 'Structure',
      },
      {
        label: 'ENVIRandomizeTrainTensorFlowMaskModelTask',
        kind: 7,
        sortText: '00',
        detail: 'Structure',
      },
      {
        label: 'ENVIBoundingBoxSet',
        kind: 7,
        sortText: '00',
        detail: 'Structure',
      },
      {
        label: 'ENVITensorFlowGridModel',
        kind: 7,
        sortText: '00',
        detail: 'Structure',
      },
      {
        label: 'ENVITensorFlowModel',
        kind: 7,
        sortText: '00',
        detail: 'Structure',
      },
      {
        label: 'ENVIBuildDeepLearningRasterTask',
        kind: 7,
        sortText: '00',
        detail: 'Structure',
      },
      {
        label: 'ENVIBuildLabelRasterFromROITask',
        kind: 7,
        sortText: '00',
        detail: 'Structure',
      },
      {
        label: 'ENVIBuildObjectDetectionRasterFromAnnotationTask',
        kind: 7,
        sortText: '00',
        detail: 'Structure',
      },
      {
        label: 'ENVIInitializeENVINet5ModelTask',
        kind: 7,
        sortText: '00',
        detail: 'Structure',
      },
      {
        label: 'ENVIBuildObjectDetectionRasterFromROITask',
        kind: 7,
        sortText: '00',
        detail: 'Structure',
      },
      {
        label: 'ENVIBuildObjectDetectionRasterFromVectorTask',
        kind: 7,
        sortText: '00',
        detail: 'Structure',
      },
      {
        label: 'ENVIClassActivationToClassificationTask',
        kind: 7,
        sortText: '00',
        detail: 'Structure',
      },
      {
        label: 'ENVIClassActivationToPolygonROITask',
        kind: 7,
        sortText: '00',
        detail: 'Structure',
      },
      {
        label: 'ENVISubsetLabelRasterTask',
        kind: 7,
        sortText: '00',
        detail: 'Structure',
      },
      {
        label: 'ENVIClassActivationToPolygonShapefileTask',
        kind: 7,
        sortText: '00',
        detail: 'Structure',
      },
      {
        label: 'ENVIClassActivationToPolylineShapefileTask',
        kind: 7,
        sortText: '00',
        detail: 'Structure',
      },
      {
        label: 'ENVIDeepLearningLabelRaster',
        kind: 7,
        sortText: '00',
        detail: 'Structure',
      },
      {
        label: 'ENVIDeepLearningObjectDetectionRaster',
        kind: 7,
        sortText: '00',
        detail: 'Structure',
      },
      {
        label: 'ENVITensorFlowMaskClassificationTask',
        kind: 7,
        sortText: '00',
        detail: 'Structure',
      },
      {
        label: 'ENVIDeepLearningRaster',
        kind: 7,
        sortText: '00',
        detail: 'Structure',
      },
      {
        label: 'ENVITrainTensorFlowGridModelTask',
        kind: 7,
        sortText: '00',
        detail: 'Structure',
      },
      {
        label: 'ENVIExtractDeepLearningLabelRasterFromFileTask',
        kind: 7,
        sortText: '00',
        detail: 'Structure',
      },
      {
        label: 'ENVIExtractDeepLearningRasterFromFileTask',
        kind: 7,
        sortText: '00',
        detail: 'Structure',
      },
      {
        label: 'ENVIExtractTensorFlowModelFromFileTask',
        kind: 7,
        sortText: '00',
        detail: 'Structure',
      },
      {
        label: 'ENVIPostProcessObjectClassificationTask',
        kind: 7,
        sortText: '00',
        detail: 'Structure',
      },
      {
        label: 'ENVITensorFlowGridClassificationTask',
        kind: 7,
        sortText: '00',
        detail: 'Structure',
      },
      {
        label: 'ENVIRandomizeTrainTensorFlowPixelModelTask',
        kind: 7,
        sortText: '00',
        detail: 'Structure',
      },
      {
        label: 'ENVITensorFlowObjectClassificationTask',
        kind: 7,
        sortText: '00',
        detail: 'Structure',
      },
      {
        label: 'ENVITensorFlowObjectModel',
        kind: 7,
        sortText: '00',
        detail: 'Structure',
      },
      {
        label: 'ENVITensorFlowOptimizedObjectClassificationTask',
        kind: 7,
        sortText: '00',
        detail: 'Structure',
      },
      {
        label: 'ENVITensorFlowOptimizedPixelClassificationTask',
        kind: 7,
        sortText: '00',
        detail: 'Structure',
      },
      {
        label: 'ENVITensorFlowPixelClassificationTask',
        kind: 7,
        sortText: '00',
        detail: 'Structure',
      },
      {
        label: 'ENVITrainTensorFlowMaskModelTask',
        kind: 7,
        sortText: '00',
        detail: 'Structure',
      },
      {
        label: 'ENVITrainTensorFlowObjectModelTask',
        kind: 7,
        sortText: '00',
        detail: 'Structure',
      },
      {
        label: 'ENVITrainTensorFlowPixelModelTask',
        kind: 7,
        sortText: '00',
        detail: 'Structure',
      },
      {
        label: 'ENVIStretchParameters',
        kind: 7,
        sortText: '00',
        detail: 'Structure',
      },
      {
        label: 'ENVIImageToImageRegistrationTask',
        kind: 7,
        sortText: '00',
        detail: 'Structure',
      },
      {
        label: 'ENVIDiceRasterByVectorTask',
        kind: 7,
        sortText: '00',
        detail: 'Structure',
      },
      {
        label: 'ENVIConvertGeographicToMapCoordinatesTask',
        kind: 7,
        sortText: '00',
        detail: 'Structure',
      },
      { label: 'ENVITask', kind: 7, sortText: '00', detail: 'Structure' },
      { label: 'ENVIAbortable', kind: 7, sortText: '00', detail: 'Structure' },
      {
        label: 'ENVILinearSpectralUnmixingTask',
        kind: 7,
        sortText: '00',
        detail: 'Structure',
      },
      {
        label: 'ENVIVectorRecordsToBoundingBoxTask',
        kind: 7,
        sortText: '00',
        detail: 'Structure',
      },
      {
        label: 'ENVIMaximumLikelihoodClassificationTask',
        kind: 7,
        sortText: '00',
        detail: 'Structure',
      },
      {
        label: 'ENVICalibrateRaster',
        kind: 7,
        sortText: '00',
        detail: 'Structure',
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
