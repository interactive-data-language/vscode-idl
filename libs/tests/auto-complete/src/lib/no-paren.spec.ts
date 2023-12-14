import { LogManager } from '@idl/logger';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { GetExtensionPath } from '@idl/shared';
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
        insertText: 'ENVIBoundingBoxSet',
        kind: 3,
        sortText: '03',
        detail: 'Function',
        command: { title: 'Cursor Adjust', command: 'cursorRight' },
      },
      {
        label: "ENVITask('BuildDeepLearningRaster')",
        insertText: "ENVITask('BuildDeepLearningRaster')",
        kind: 3,
        sortText: '03',
        detail: 'Function',
      },
      {
        label: "ENVITask('BuildLabelRasterFromROI')",
        insertText: "ENVITask('BuildLabelRasterFromROI')",
        kind: 3,
        sortText: '03',
        detail: 'Function',
      },
      {
        label: "ENVITask('BuildObjectDetectionRasterFromAnnotation')",
        insertText: "ENVITask('BuildObjectDetectionRasterFromAnnotation')",
        kind: 3,
        sortText: '03',
        detail: 'Function',
      },
      {
        label: "ENVITask('BuildObjectDetectionRasterFromROI')",
        insertText: "ENVITask('BuildObjectDetectionRasterFromROI')",
        kind: 3,
        sortText: '03',
        detail: 'Function',
      },
      {
        label: "ENVITask('BuildObjectDetectionRasterFromVector')",
        insertText: "ENVITask('BuildObjectDetectionRasterFromVector')",
        kind: 3,
        sortText: '03',
        detail: 'Function',
      },
      {
        label: "ENVITask('ClassActivationToClassification')",
        insertText: "ENVITask('ClassActivationToClassification')",
        kind: 3,
        sortText: '03',
        detail: 'Function',
      },
      {
        label: "ENVITask('ClassActivationToPolygonROI')",
        insertText: "ENVITask('ClassActivationToPolygonROI')",
        kind: 3,
        sortText: '03',
        detail: 'Function',
      },
      {
        label: "ENVITask('ClassActivationToPolygonShapefile')",
        insertText: "ENVITask('ClassActivationToPolygonShapefile')",
        kind: 3,
        sortText: '03',
        detail: 'Function',
      },
      {
        label: "ENVITask('ClassActivationToPolylineShapefile')",
        insertText: "ENVITask('ClassActivationToPolylineShapefile')",
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
        command: { title: 'Cursor Adjust', command: 'cursorRight' },
      },
      {
        label: 'ENVIDeepLearningLabelRaster()',
        insertText: 'ENVIDeepLearningLabelRaster',
        kind: 3,
        sortText: '03',
        detail: 'Function',
        command: { title: 'Cursor Adjust', command: 'cursorRight' },
      },
      {
        label: 'ENVIDeepLearningObjectDetectionRaster()',
        insertText: 'ENVIDeepLearningObjectDetectionRaster',
        kind: 3,
        sortText: '03',
        detail: 'Function',
        command: { title: 'Cursor Adjust', command: 'cursorRight' },
      },
      {
        label: 'ENVIDeepLearningROIToGeoJSON()',
        insertText: 'ENVIDeepLearningROIToGeoJSON',
        kind: 3,
        sortText: '03',
        detail: 'Function',
        command: { title: 'Cursor Adjust', command: 'cursorRight' },
      },
      {
        label: "ENVITask('TensorFlowMaskClassification')",
        insertText: "ENVITask('TensorFlowMaskClassification')",
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
        command: { title: 'Cursor Adjust', command: 'cursorRight' },
      },
      {
        label: "ENVITask('ExtractDeepLearningLabelRasterFromFile')",
        insertText: "ENVITask('ExtractDeepLearningLabelRasterFromFile')",
        kind: 3,
        sortText: '03',
        detail: 'Function',
      },
      {
        label: "ENVITask('ExtractDeepLearningRasterFromFile')",
        insertText: "ENVITask('ExtractDeepLearningRasterFromFile')",
        kind: 3,
        sortText: '03',
        detail: 'Function',
      },
      {
        label: "ENVITask('ExtractTensorFlowModelFromFile')",
        insertText: "ENVITask('ExtractTensorFlowModelFromFile')",
        kind: 3,
        sortText: '03',
        detail: 'Function',
      },
      {
        label: "ENVITask('TrainTensorFlowObjectModel')",
        insertText: "ENVITask('TrainTensorFlowObjectModel')",
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
        command: { title: 'Cursor Adjust', command: 'cursorRight' },
      },
      {
        label: "ENVITask('PostProcessObjectClassification')",
        insertText: "ENVITask('PostProcessObjectClassification')",
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
        command: { title: 'Cursor Adjust', command: 'cursorRight' },
      },
      {
        label: "ENVITask('TensorFlowObjectClassification')",
        insertText: "ENVITask('TensorFlowObjectClassification')",
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
        command: { title: 'Cursor Adjust', command: 'cursorRight' },
      },
      {
        label: "ENVITask('TrainTensorFlowMaskModel')",
        insertText: "ENVITask('TrainTensorFlowMaskModel')",
        kind: 3,
        sortText: '03',
        detail: 'Function',
      },
      {
        label: "ENVITask('QuerySpectralLibrary')",
        insertText: "ENVITask('QuerySpectralLibrary')",
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
        command: { title: 'Cursor Adjust', command: 'cursorRight' },
      },
      {
        label: "ENVITask('DiceRasterByVector')",
        insertText: "ENVITask('DiceRasterByVector')",
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
        command: { title: 'Cursor Adjust', command: 'cursorRight' },
      },
      {
        label: "ENVITask('LinearSpectralUnmixing')",
        insertText: "ENVITask('LinearSpectralUnmixing')",
        kind: 3,
        sortText: '03',
        detail: 'Function',
      },
      {
        label: "ENVITask('DirectionalKernel')",
        insertText: "ENVITask('DirectionalKernel')",
        kind: 3,
        sortText: '03',
        detail: 'Function',
      },
      {
        label: "ENVITask('VectorRecordsToBoundingBox')",
        insertText: "ENVITask('VectorRecordsToBoundingBox')",
        kind: 3,
        sortText: '03',
        detail: 'Function',
      },
      {
        label: "ENVITask('MaximumLikelihoodClassification')",
        insertText: "ENVITask('MaximumLikelihoodClassification')",
        kind: 3,
        sortText: '03',
        detail: 'Function',
      },
      {
        label: "ENVITask('PercentThresholdClassification')",
        insertText: "ENVITask('PercentThresholdClassification')",
        kind: 3,
        sortText: '03',
        detail: 'Function',
      },
      {
        label: "ENVITask('VectorRecordsToROI')",
        insertText: "ENVITask('VectorRecordsToROI')",
        kind: 3,
        sortText: '03',
        detail: 'Function',
      },
      {
        label: "ENVITask('FireFuelClassification')",
        insertText: "ENVITask('FireFuelClassification')",
        kind: 3,
        sortText: '03',
        detail: 'Function',
      },
      {
        label: 'ENVINNDiffusePanSharpeningRaster()',
        insertText: 'ENVINNDiffusePanSharpeningRaster',
        kind: 3,
        sortText: '03',
        detail: 'Function',
        command: { title: 'Cursor Adjust', command: 'cursorRight' },
      },
      {
        label: "ENVITask('CreateSubrectsFromTileCount')",
        insertText: "ENVITask('CreateSubrectsFromTileCount')",
        kind: 3,
        sortText: '03',
        detail: 'Function',
      },
      {
        label: "ENVITask('NNDiffusePanSharpening')",
        insertText: "ENVITask('NNDiffusePanSharpening')",
        kind: 3,
        sortText: '03',
        detail: 'Function',
      },
      {
        label: "ENVITask('ImageIntersection')",
        insertText: "ENVITask('ImageIntersection')",
        kind: 3,
        sortText: '03',
        detail: 'Function',
      },
      {
        label: 'ENVIBinaryGTThresholdRaster()',
        insertText: 'ENVIBinaryGTThresholdRaster',
        kind: 3,
        sortText: '03',
        detail: 'Function',
        command: { title: 'Cursor Adjust', command: 'cursorRight' },
      },
      {
        label: 'ENVIRadarBackscatterRaster()',
        insertText: 'ENVIRadarBackscatterRaster',
        kind: 3,
        sortText: '03',
        detail: 'Function',
        command: { title: 'Cursor Adjust', command: 'cursorRight' },
      },
      {
        label: "ENVITask('AutoChangeThresholdClassification')",
        insertText: "ENVITask('AutoChangeThresholdClassification')",
        kind: 3,
        sortText: '03',
        detail: 'Function',
      },
      {
        label: "ENVITask('GenerateGCPsFromTiePoints')",
        insertText: "ENVITask('GenerateGCPsFromTiePoints')",
        kind: 3,
        sortText: '03',
        detail: 'Function',
      },
      {
        label: "ENVITask('LabelEntropyTexture')",
        insertText: "ENVITask('LabelEntropyTexture')",
        kind: 3,
        sortText: '03',
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
        sortText: '03',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorRight' },
      },
      {
        label: 'IDLitComponent::editUserDefProperty()',
        insertText: 'editUserDefProperty',
        kind: 2,
        sortText: '03',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorRight' },
      },
      {
        label: 'IDLitComponent::getFullIdentifier()',
        insertText: 'getFullIdentifier',
        kind: 2,
        sortText: '03',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorRight' },
      },
      {
        label: 'IDLitComponent::getPropertyByIdentifier()',
        insertText: 'getPropertyByIdentifier',
        kind: 2,
        sortText: '03',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorRight' },
      },
      {
        label: 'IDLitComponent::queryProperty()',
        insertText: 'queryProperty',
        kind: 2,
        sortText: '03',
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
        sortText: '03',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorRight' },
      },
      {
        label: 'IDLitComponent::editUserDefProperty()',
        insertText: 'editUserDefProperty',
        kind: 2,
        sortText: '03',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorRight' },
      },
      {
        label: 'IDLitComponent::getFullIdentifier()',
        insertText: 'getFullIdentifier',
        kind: 2,
        sortText: '03',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorRight' },
      },
      {
        label: 'IDLitComponent::getPropertyByIdentifier()',
        insertText: 'getPropertyByIdentifier',
        kind: 2,
        sortText: '03',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorRight' },
      },
      {
        label: 'IDLitComponent::queryProperty()',
        insertText: 'queryProperty',
        kind: 2,
        sortText: '03',
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
