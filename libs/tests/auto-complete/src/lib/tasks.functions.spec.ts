import { LogManager } from '@idl/logger';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { GetExtensionPath } from '@idl/shared';
import { readFile } from 'fs/promises';
import { CompletionItem, Position } from 'vscode-languageserver/node';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] Task auto complete`, () => {
  it(`[auto generated] to make sure they look nice`, async () => {
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
      'idl/test/auto-complete/task_functions.pro'
    );

    // add file to index
    await index.indexFile(filepath);

    // define position
    const position_0: Position = { line: 3, character: 8 };

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
        label: "ENVITask('InitializeENVINet5Model')",
        insertText: "ENVITask('InitializeENVINet5Model')",
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
        label: "ENVITask('SubsetLabelRaster')",
        insertText: "ENVITask('SubsetLabelRaster')",
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
        label: "ENVITask('TensorFlowMaskClassification')",
        insertText: "ENVITask('TensorFlowMaskClassification')",
        kind: 3,
        sortText: '03',
        detail: 'Function',
      },
      {
        label: "ENVITask('TrainTensorFlowGridModel')",
        insertText: "ENVITask('TrainTensorFlowGridModel')",
        kind: 3,
        sortText: '03',
        detail: 'Function',
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
        label: "ENVITask('PostProcessObjectClassification')",
        insertText: "ENVITask('PostProcessObjectClassification')",
        kind: 3,
        sortText: '03',
        detail: 'Function',
      },
      {
        label: "ENVITask('TensorFlowGridClassification')",
        insertText: "ENVITask('TensorFlowGridClassification')",
        kind: 3,
        sortText: '03',
        detail: 'Function',
      },
      {
        label: "ENVITask('RandomizeTrainTensorFlowPixelModel')",
        insertText: "ENVITask('RandomizeTrainTensorFlowPixelModel')",
        kind: 3,
        sortText: '03',
        detail: 'Function',
      },
      {
        label: "ENVITask('TensorFlowObjectClassification')",
        insertText: "ENVITask('TensorFlowObjectClassification')",
        kind: 3,
        sortText: '03',
        detail: 'Function',
      },
      {
        label: "ENVITask('TensorFlowOptimizedObjectClassification')",
        insertText: "ENVITask('TensorFlowOptimizedObjectClassification')",
        kind: 3,
        sortText: '03',
        detail: 'Function',
      },
      {
        label: "ENVITask('TensorFlowOptimizedPixelClassification')",
        insertText: "ENVITask('TensorFlowOptimizedPixelClassification')",
        kind: 3,
        sortText: '03',
        detail: 'Function',
      },
      {
        label: "ENVITask('TensorFlowPixelClassification')",
        insertText: "ENVITask('TensorFlowPixelClassification')",
        kind: 3,
        sortText: '03',
        detail: 'Function',
      },
      {
        label: "ENVITask('TrainTensorFlowMaskModel')",
        insertText: "ENVITask('TrainTensorFlowMaskModel')",
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
        label: "ENVITask('TrainTensorFlowPixelModel')",
        insertText: "ENVITask('TrainTensorFlowPixelModel')",
        kind: 3,
        sortText: '03',
        detail: 'Function',
      },
      {
        label: "ENVITask('ImageToImageRegistration')",
        insertText: "ENVITask('ImageToImageRegistration')",
        kind: 3,
        sortText: '03',
        detail: 'Function',
      },
      {
        label: "ENVITask('DiceRasterByVector')",
        insertText: "ENVITask('DiceRasterByVector')",
        kind: 3,
        sortText: '03',
        detail: 'Function',
      },
      {
        label: "ENVITask('ConvertGeographicToMapCoordinates')",
        insertText: "ENVITask('ConvertGeographicToMapCoordinates')",
        kind: 3,
        sortText: '03',
        detail: 'Function',
      },
      {
        label: 'ENVITask()',
        insertText: 'ENVITask()',
        kind: 3,
        sortText: '03',
        detail: 'Function',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: "ENVITask('LinearSpectralUnmixing')",
        insertText: "ENVITask('LinearSpectralUnmixing')",
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
        label: "ENVITask('FilterTiePointsByFundamentalMatrix')",
        insertText: "ENVITask('FilterTiePointsByFundamentalMatrix')",
        kind: 3,
        sortText: '03',
        detail: 'Function',
      },
      {
        label: "ENVITask('MedianFilter')",
        insertText: "ENVITask('MedianFilter')",
        kind: 3,
        sortText: '03',
        detail: 'Function',
      },
      {
        label:
          "ENVITask('AgCalculateAndRasterizeCropMetricsWithSpectralIndex')",
        insertText:
          "ENVITask('AgCalculateAndRasterizeCropMetricsWithSpectralIndex')",
        kind: 3,
        sortText: '03',
        detail: 'Function',
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
        label: "ENVITask('AutoChangeThresholdClassification')",
        insertText: "ENVITask('AutoChangeThresholdClassification')",
        kind: 3,
        sortText: '03',
        detail: 'Function',
      },
      {
        label: "ENVITask('VectorRecordsToSeparateROI')",
        insertText: "ENVITask('VectorRecordsToSeparateROI')",
        kind: 3,
        sortText: '03',
        detail: 'Function',
      },
      {
        label: "ENVITask('CreateSubrectsFromDistance')",
        insertText: "ENVITask('CreateSubrectsFromDistance')",
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
      {
        label: "ENVITask('GenerateGCPsFromTiePoints')",
        insertText: "ENVITask('GenerateGCPsFromTiePoints')",
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
      )
        .filter((item) => item?.label?.startsWith('ENVITask'))
        .slice(0, 50)
    );
  });
});
