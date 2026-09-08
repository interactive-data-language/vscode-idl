/**
 * ENVI tools that we do regression tests for
 */
export const REGRESSION_TEST_THESE = [
  'ClassificationToShapefile',
  'ColorSliceClassification',
  'DeepLearningPixelClassification',
  // 'EditRasterMetadata', // filtered out, duplicates rasters and shouldnt be used
  'ExportRasterToPNG',
  'ExportRasterToTIFF',
  'FLAASH',
  'ExportRasterToNITF21',
  'ISODataClassification',
  'MaximumLikelihoodClassification',
  'ROIStatistics',
  'SpectralIndex',
];
