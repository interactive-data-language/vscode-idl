import { GetExtensionPath } from '@idl/idl/files';
import { LogManager } from '@idl/logger';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { readFile } from 'fs/promises';
import { CompletionItem, Position } from 'vscode-languageserver/node';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] Exclude parentheses`, () => {
  it(`[auto generated] for functions and function methods`, async () => {
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
    const filepath = GetExtensionPath('idl/test/auto-complete/examples.pro');

    // add file to index
    await index.indexFile(filepath);

    // define position
    const position_0: Position = { line: 10, character: 9 };

    // define expected token we extract
    const expectedFound_0: CompletionItem[] = [
      {
        label: "ENVITask('DeepLearningPixelClassification')",
        insertText: "ENVITask('DeepLearningPixelClassification')",
        kind: 3,
        sortText: '40',
        detail: 'Function',
      },
      {
        label: "ENVITask('BuildLabelRasterFromClassification')",
        insertText: "ENVITask('BuildLabelRasterFromClassification')",
        kind: 3,
        sortText: '40',
        detail: 'Function',
      },
      {
        label: "ENVITask('ClassActivationToPolylineShapefile')",
        insertText: "ENVITask('ClassActivationToPolylineShapefile')",
        kind: 3,
        sortText: '40',
        detail: 'Function',
      },
      {
        label: "ENVITask('ClassActivationToPixelROI')",
        insertText: "ENVITask('ClassActivationToPixelROI')",
        kind: 3,
        sortText: '40',
        detail: 'Function',
      },
      {
        label: 'ENVIBoundingBoxSet()',
        insertText: 'ENVIBoundingBoxSet',
        kind: 3,
        sortText: '40',
        detail: 'Function',
        command: { title: 'Cursor Adjust', command: 'cursorRight' },
      },
      {
        label: "ENVITask('ConfigureOnnxModel')",
        insertText: "ENVITask('ConfigureOnnxModel')",
        kind: 3,
        sortText: '40',
        detail: 'Function',
      },
      {
        label: "ENVITask('TrainDeepLearningGridModel')",
        insertText: "ENVITask('TrainDeepLearningGridModel')",
        kind: 3,
        sortText: '40',
        detail: 'Function',
      },
      {
        label: 'ENVIDeepLearningGeoJSONToROI()',
        insertText: 'ENVIDeepLearningGeoJSONToROI',
        kind: 3,
        sortText: '40',
        detail: 'Function',
        command: { title: 'Cursor Adjust', command: 'cursorRight' },
      },
      {
        label: 'ENVIDeepLearningLabelRaster()',
        insertText: 'ENVIDeepLearningLabelRaster',
        kind: 3,
        sortText: '40',
        detail: 'Function',
        command: { title: 'Cursor Adjust', command: 'cursorRight' },
      },
      {
        label: "ENVITask('ExtractDeepLearningRasterFromFile')",
        insertText: "ENVITask('ExtractDeepLearningRasterFromFile')",
        kind: 3,
        sortText: '40',
        detail: 'Function',
      },
      {
        label: "ENVITask('BuildDeepLearningRaster')",
        insertText: "ENVITask('BuildDeepLearningRaster')",
        kind: 3,
        sortText: '40',
        detail: 'Function',
      },
      {
        label: "ENVITask('BuildLabelRasterFromROI')",
        insertText: "ENVITask('BuildLabelRasterFromROI')",
        kind: 3,
        sortText: '40',
        detail: 'Function',
      },
      {
        label: "ENVITask('ExtractDeepLearningKerasModelFromFile')",
        insertText: "ENVITask('ExtractDeepLearningKerasModelFromFile')",
        kind: 3,
        sortText: '40',
        detail: 'Function',
      },
      {
        label: "ENVITask('PublishENVIDeepLearningOnnxModel')",
        insertText: "ENVITask('PublishENVIDeepLearningOnnxModel')",
        kind: 3,
        sortText: '40',
        detail: 'Function',
      },
      {
        label: "ENVITask('BuildObjectDetectionRasterFromAnnotation')",
        insertText: "ENVITask('BuildObjectDetectionRasterFromAnnotation')",
        kind: 3,
        sortText: '40',
        detail: 'Function',
      },
      {
        label: "ENVITask('DeepLearningOptimizedPixelClassification')",
        insertText: "ENVITask('DeepLearningOptimizedPixelClassification')",
        kind: 3,
        sortText: '40',
        detail: 'Function',
      },
      {
        label: "ENVITask('BuildObjectDetectionRasterFromROI')",
        insertText: "ENVITask('BuildObjectDetectionRasterFromROI')",
        kind: 3,
        sortText: '40',
        detail: 'Function',
      },
      {
        label: "ENVITask('BuildObjectDetectionRasterFromVector')",
        insertText: "ENVITask('BuildObjectDetectionRasterFromVector')",
        kind: 3,
        sortText: '40',
        detail: 'Function',
      },
      {
        label: "ENVITask('DeepLearningGridClassification')",
        insertText: "ENVITask('DeepLearningGridClassification')",
        kind: 3,
        sortText: '40',
        detail: 'Function',
      },
      {
        label: "ENVITask('BuildObjectDetectionRastersFromCOCO')",
        insertText: "ENVITask('BuildObjectDetectionRastersFromCOCO')",
        kind: 3,
        sortText: '40',
        detail: 'Function',
      },
      {
        label: "ENVITask('ExtractDeepLearningOnnxModelFromFile')",
        insertText: "ENVITask('ExtractDeepLearningOnnxModelFromFile')",
        kind: 3,
        sortText: '40',
        detail: 'Function',
      },
      {
        label: "ENVITask('ClassActivationToClassification')",
        insertText: "ENVITask('ClassActivationToClassification')",
        kind: 3,
        sortText: '40',
        detail: 'Function',
      },
      {
        label: "ENVITask('ClassActivationToPolygonROI')",
        insertText: "ENVITask('ClassActivationToPolygonROI')",
        kind: 3,
        sortText: '40',
        detail: 'Function',
      },
      {
        label: "ENVITask('ClassActivationToPolygonShapefile')",
        insertText: "ENVITask('ClassActivationToPolygonShapefile')",
        kind: 3,
        sortText: '40',
        detail: 'Function',
      },
      {
        label: "ENVITask('ExtractDeepLearningLabelRasterFromFile')",
        insertText: "ENVITask('ExtractDeepLearningLabelRasterFromFile')",
        kind: 3,
        sortText: '40',
        detail: 'Function',
      },
      {
        label: "ENVITask('DeepLearningOptimizedObjectClassification')",
        insertText: "ENVITask('DeepLearningOptimizedObjectClassification')",
        kind: 3,
        sortText: '40',
        detail: 'Function',
      },
      {
        label: 'ENVIDeepLearningKerasModel()',
        insertText: 'ENVIDeepLearningKerasModel',
        kind: 3,
        sortText: '40',
        detail: 'Function',
        command: { title: 'Cursor Adjust', command: 'cursorRight' },
      },
      {
        label: "ENVITask('DeepLearningObjectClassification')",
        insertText: "ENVITask('DeepLearningObjectClassification')",
        kind: 3,
        sortText: '40',
        detail: 'Function',
      },
      {
        label: 'ENVIDeepLearningObjectDetectionRaster()',
        insertText: 'ENVIDeepLearningObjectDetectionRaster',
        kind: 3,
        sortText: '40',
        detail: 'Function',
        command: { title: 'Cursor Adjust', command: 'cursorRight' },
      },
      {
        label: 'return()',
        insertText: 'return',
        kind: 3,
        sortText: '40',
        detail: 'Function',
        command: { title: 'Cursor Adjust', command: 'cursorRight' },
      },
      {
        label: "ENVITask('PostProcessObjectClassification')",
        insertText: "ENVITask('PostProcessObjectClassification')",
        kind: 3,
        sortText: '40',
        detail: 'Function',
      },
      {
        label: 'ENVIDeepLearningOnnxModel()',
        insertText: 'ENVIDeepLearningOnnxModel',
        kind: 3,
        sortText: '40',
        detail: 'Function',
        command: { title: 'Cursor Adjust', command: 'cursorRight' },
      },
      {
        label: 'ENVIDeepLearningROIToGeoJSON()',
        insertText: 'ENVIDeepLearningROIToGeoJSON',
        kind: 3,
        sortText: '40',
        detail: 'Function',
        command: { title: 'Cursor Adjust', command: 'cursorRight' },
      },
      {
        label: 'ENVIDeepLearningRaster()',
        insertText: 'ENVIDeepLearningRaster',
        kind: 3,
        sortText: '40',
        detail: 'Function',
        command: { title: 'Cursor Adjust', command: 'cursorRight' },
      },
      {
        label: "ENVITask('RandomizeTrainDeepLearningPixelModel')",
        insertText: "ENVITask('RandomizeTrainDeepLearningPixelModel')",
        kind: 3,
        sortText: '40',
        detail: 'Function',
      },
      {
        label: "ENVITask('SubsetLabelRaster')",
        insertText: "ENVITask('SubsetLabelRaster')",
        kind: 3,
        sortText: '40',
        detail: 'Function',
      },
      {
        label: "ENVITask('TrainDeepLearningObjectModel')",
        insertText: "ENVITask('TrainDeepLearningObjectModel')",
        kind: 3,
        sortText: '40',
        detail: 'Function',
      },
      {
        label: "ENVITask('TrainDeepLearningPixelModel')",
        insertText: "ENVITask('TrainDeepLearningPixelModel')",
        kind: 3,
        sortText: '40',
        detail: 'Function',
      },
      {
        label: 'ENVIStretchParameters()',
        insertText: 'ENVIStretchParameters',
        kind: 3,
        sortText: '40',
        detail: 'Function',
        command: { title: 'Cursor Adjust', command: 'cursorRight' },
      },
      {
        label: "ENVITask('ImageToImageRegistration')",
        insertText: "ENVITask('ImageToImageRegistration')",
        kind: 3,
        sortText: '40',
        detail: 'Function',
      },
      {
        label: "ENVITask('BuildRasterPyramids')",
        insertText: "ENVITask('BuildRasterPyramids')",
        kind: 3,
        sortText: '40',
        detail: 'Function',
      },
      {
        label: "ENVITask('GenerateMaskFromVector')",
        insertText: "ENVITask('GenerateMaskFromVector')",
        kind: 3,
        sortText: '40',
        detail: 'Function',
      },
      {
        label: "ENVITask('DiceRasterByVector')",
        insertText: "ENVITask('DiceRasterByVector')",
        kind: 3,
        sortText: '40',
        detail: 'Function',
      },
      {
        label: "ENVITask('TopographicBreaklines')",
        insertText: "ENVITask('TopographicBreaklines')",
        kind: 3,
        sortText: '40',
        detail: 'Function',
      },
      {
        label: "ENVITask('ConvertGeographicToMapCoordinates')",
        insertText: "ENVITask('ConvertGeographicToMapCoordinates')",
        kind: 3,
        sortText: '40',
        detail: 'Function',
      },
      {
        label: 'ENVITask()',
        insertText: 'ENVITask',
        kind: 3,
        sortText: '40',
        detail: 'Function',
        command: { title: 'Cursor Adjust', command: 'cursorRight' },
      },
      {
        label: 'ENVIAbortable()',
        insertText: 'ENVIAbortable',
        kind: 3,
        sortText: '40',
        detail: 'Function',
        command: { title: 'Cursor Adjust', command: 'cursorRight' },
      },
      {
        label: "ENVITask('VectorRecordsToBoundingBox')",
        insertText: "ENVITask('VectorRecordsToBoundingBox')",
        kind: 3,
        sortText: '40',
        detail: 'Function',
      },
      {
        label: "ENVITask('MaximumLikelihoodClassification')",
        insertText: "ENVITask('MaximumLikelihoodClassification')",
        kind: 3,
        sortText: '40',
        detail: 'Function',
      },
      {
        label: "ENVITask('VectorRecordsToROI')",
        insertText: "ENVITask('VectorRecordsToROI')",
        kind: 3,
        sortText: '40',
        detail: 'Function',
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
    const position_1: Position = { line: 11, character: 12 };

    // define expected token we extract
    const expectedFound_1: CompletionItem[] = [
      {
        label: 'IDLgrSurface::getCTM()',
        insertText: 'getCtm',
        kind: 2,
        sortText: '40',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorRight' },
      },
      {
        label: 'IDLitComponent::editUserDefProperty()',
        insertText: 'editUserDefProperty',
        kind: 2,
        sortText: '40',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorRight' },
      },
      {
        label: 'IDLitComponent::getFullIdentifier()',
        insertText: 'getFullIdentifier',
        kind: 2,
        sortText: '40',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorRight' },
      },
      {
        label: 'IDLitComponent::getPropertyByIdentifier()',
        insertText: 'getPropertyByIdentifier',
        kind: 2,
        sortText: '40',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorRight' },
      },
      {
        label: 'IDLitComponent::queryProperty()',
        insertText: 'queryProperty',
        kind: 2,
        sortText: '40',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorRight' },
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
    const position_2: Position = { line: 12, character: 14 };

    // define expected token we extract
    const expectedFound_2: CompletionItem[] = [
      {
        label: 'IDLgrSurface::getCTM()',
        insertText: 'getCtm',
        kind: 2,
        sortText: '40',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorRight' },
      },
      {
        label: 'IDLitComponent::editUserDefProperty()',
        insertText: 'editUserDefProperty',
        kind: 2,
        sortText: '40',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorRight' },
      },
      {
        label: 'IDLitComponent::getFullIdentifier()',
        insertText: 'getFullIdentifier',
        kind: 2,
        sortText: '40',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorRight' },
      },
      {
        label: 'IDLitComponent::getPropertyByIdentifier()',
        insertText: 'getPropertyByIdentifier',
        kind: 2,
        sortText: '40',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorRight' },
      },
      {
        label: 'IDLitComponent::queryProperty()',
        insertText: 'queryProperty',
        kind: 2,
        sortText: '40',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorRight' },
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
  });
});
