import { LogManager } from '@idl/logger';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { GetExtensionPath } from '@idl/shared';
import { readFile } from 'fs/promises';
import { CompletionItem, Position } from 'vscode-languageserver/node';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] Verify auto-complete in structures`, () => {
  it(`[auto generated] for properties, property completion, and normal property completion`, async () => {
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
      'idl/test/auto-complete/in_structures.pro'
    );

    // add file to index
    await index.indexFile(filepath);

    // define position
    const position_0: Position = { line: 17, character: 15 };

    // define expected token we extract
    const expectedFound_0: CompletionItem[] = [
      {
        label: 'prop1',
        insertText: 'prop1:',
        kind: 5,
        sortText: '02',
        detail: 'Property of NYStruct',
        documentation: 'Placeholder docs for argument, keyword, or property',
      },
      {
        label: 'prop2',
        insertText: 'prop2:',
        kind: 5,
        sortText: '02',
        detail: 'Property of NYStruct',
        documentation: 'Placeholder docs for argument, keyword, or property',
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
    const position_1: Position = { line: 19, character: 22 };

    // define expected token we extract
    const expectedFound_1: CompletionItem[] = [
      {
        label: 'a',
        kind: 6,
        sortText: '01',
        detail: 'Variable',
        documentation: '',
      },
      {
        label: 'b',
        kind: 6,
        sortText: '01',
        detail: 'Variable',
        documentation: '',
      },
      {
        label: 'something',
        kind: 6,
        sortText: '01',
        detail: 'Variable',
        documentation: '',
      },
      {
        label: 'byte1',
        kind: 6,
        sortText: '01',
        detail: 'Variable',
        documentation: '',
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
    const position_2: Position = { line: 21, character: 47 };

    // define expected token we extract
    const expectedFound_2: CompletionItem[] = [
      {
        label: 'ENVIBoundingBoxSet::getBoundingBox()',
        insertText: 'getBoundingBox()',
        kind: 2,
        sortText: '03',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'ENVIBoundingBoxSet::getENVIGeoJSON()',
        insertText: 'getENVIGeoJSON()',
        kind: 2,
        sortText: '03',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'ENVIBoundingBoxSet::getGeoJSON()',
        insertText: 'getGeoJSON()',
        kind: 2,
        sortText: '03',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'ENVITensorFlowGridModel::dehydrate()',
        insertText: 'dehydrate()',
        kind: 2,
        sortText: '03',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'ENVITensorFlowGridModel::hydrate()',
        insertText: 'hydrate()',
        kind: 2,
        sortText: '03',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'ENVITensorFlowModel::dehydrate()',
        insertText: 'dehydrate()',
        kind: 2,
        sortText: '03',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'ENVITensorFlowModel::hydrate()',
        insertText: 'hydrate()',
        kind: 2,
        sortText: '03',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'ENVIDeepLearningLabelRaster::createTileIterator()',
        insertText: 'createTileIterator()',
        kind: 2,
        sortText: '03',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'ENVIDeepLearningLabelRaster::getData()',
        insertText: 'getData()',
        kind: 2,
        sortText: '03',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'ENVIDeepLearningLabelRaster::hydrate()',
        insertText: 'hydrate()',
        kind: 2,
        sortText: '03',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'ENVIDeepLearningRaster::createTileIterator()',
        insertText: 'createTileIterator()',
        kind: 2,
        sortText: '03',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'ENVIDeepLearningRaster::getData()',
        insertText: 'getData()',
        kind: 2,
        sortText: '03',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'ENVIDeepLearningRaster::hydrate()',
        insertText: 'hydrate()',
        kind: 2,
        sortText: '03',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'ENVITensorFlowObjectModel::dehydrate()',
        insertText: 'dehydrate()',
        kind: 2,
        sortText: '03',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'ENVITensorFlowObjectModel::hydrate()',
        insertText: 'hydrate()',
        kind: 2,
        sortText: '03',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'ENVIStretchParameters::dehydrate()',
        insertText: 'dehydrate()',
        kind: 2,
        sortText: '03',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'ENVIStretchParameters::hydrate()',
        insertText: 'hydrate()',
        kind: 2,
        sortText: '03',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'ENVITask::dehydrate()',
        insertText: 'dehydrate()',
        kind: 2,
        sortText: '03',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'ENVITask::hydrate()',
        insertText: 'hydrate()',
        kind: 2,
        sortText: '03',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'ENVITask::parameter()',
        insertText: 'parameter()',
        kind: 2,
        sortText: '03',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'ENVITask::parameterNames()',
        insertText: 'parameterNames()',
        kind: 2,
        sortText: '03',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'ENVITask::validate()',
        insertText: 'validate()',
        kind: 2,
        sortText: '03',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'ENVICalibrateRaster::dehydrate()',
        insertText: 'dehydrate()',
        kind: 2,
        sortText: '03',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'ENVICalibrateRaster::hydrate()',
        insertText: 'hydrate()',
        kind: 2,
        sortText: '03',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'ENVINNDiffusePanSharpeningRaster::dehydrate()',
        insertText: 'dehydrate()',
        kind: 2,
        sortText: '03',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'ENVINNDiffusePanSharpeningRaster::hydrate()',
        insertText: 'hydrate()',
        kind: 2,
        sortText: '03',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'ENVIBinaryGTThresholdRaster::dehydrate()',
        insertText: 'dehydrate()',
        kind: 2,
        sortText: '03',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'ENVIBinaryGTThresholdRaster::hydrate()',
        insertText: 'hydrate()',
        kind: 2,
        sortText: '03',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'ENVIRadarBackscatterRaster::dehydrate()',
        insertText: 'dehydrate()',
        kind: 2,
        sortText: '03',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'ENVIRadarBackscatterRaster::hydrate()',
        insertText: 'hydrate()',
        kind: 2,
        sortText: '03',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'ENVILinearPercentStretchRaster::dehydrate()',
        insertText: 'dehydrate()',
        kind: 2,
        sortText: '03',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'ENVILinearPercentStretchRaster::hydrate()',
        insertText: 'hydrate()',
        kind: 2,
        sortText: '03',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'ENVIWorkflowStep::getUIObject()',
        insertText: 'getUiObject()',
        kind: 2,
        sortText: '03',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'ENVIWorkflowStep::isLastStep()',
        insertText: 'isLastStep()',
        kind: 2,
        sortText: '03',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'ENVIFirstOrderEntropyTextureRaster::dehydrate()',
        insertText: 'dehydrate()',
        kind: 2,
        sortText: '03',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'ENVIFirstOrderEntropyTextureRaster::hydrate()',
        insertText: 'hydrate()',
        kind: 2,
        sortText: '03',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'ENVIDataCollection::count()',
        insertText: 'count()',
        kind: 2,
        sortText: '03',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'ENVIDataCollection::get()',
        insertText: 'get()',
        kind: 2,
        sortText: '03',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'ENVIDataValuesMaskRaster::dehydrate()',
        insertText: 'dehydrate()',
        kind: 2,
        sortText: '03',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'ENVIDataValuesMaskRaster::hydrate()',
        insertText: 'hydrate()',
        kind: 2,
        sortText: '03',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'ENVIGCPSet::applyOffset()',
        insertText: 'applyOffset()',
        kind: 2,
        sortText: '03',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'ENVIGCPSet::count()',
        insertText: 'count()',
        kind: 2,
        sortText: '03',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'ENVIGCPSet::dehydrate()',
        insertText: 'dehydrate()',
        kind: 2,
        sortText: '03',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'ENVIGCPSet::get()',
        insertText: 'get()',
        kind: 2,
        sortText: '03',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'ENVIGCPSet::hydrate()',
        insertText: 'hydrate()',
        kind: 2,
        sortText: '03',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'ENVIConfusionMatrix::accuracy()',
        insertText: 'accuracy()',
        kind: 2,
        sortText: '03',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'ENVIConfusionMatrix::columnTotals()',
        insertText: 'columnTotals()',
        kind: 2,
        sortText: '03',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'ENVIConfusionMatrix::commissionError()',
        insertText: 'commissionError()',
        kind: 2,
        sortText: '03',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'ENVIConfusionMatrix::f1()',
        insertText: 'f1()',
        kind: 2,
        sortText: '03',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'ENVIConfusionMatrix::kappaCoefficient()',
        insertText: 'kappaCoefficient()',
        kind: 2,
        sortText: '03',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
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
    const position_3: Position = { line: 24, character: 27 };

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
    // define position
    const position_4: Position = { line: 24, character: 28 };

    // define expected token we extract
    const expectedFound_4: CompletionItem[] = [
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
    expect(expectedFound_4).toEqual(
      (
        await index.getAutoComplete(
          filepath,
          await readFile(filepath, 'utf-8'),
          position_4
        )
      ).slice(0, 50)
    );
  });
});
