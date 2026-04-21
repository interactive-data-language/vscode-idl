/**
 * Track the display names of global types (i.e. structures).
 *
 * This is the extension point for types that allows us to
 * add in user/internal structures beyond IDL and have them
 * parse/display correctly.
 *
 * This is primarily for display and AutoDoc to have formatting
 * be consistent.
 */
export const CUSTOM_TYPE_DISPLAY_NAMES: { [key: string]: string } = {};

/**
 * Add in ENVI data types
 */
CUSTOM_TYPE_DISPLAY_NAMES['enviagcrops'] = 'ENVIAgCrops';
CUSTOM_TYPE_DISPLAY_NAMES['enviagzones'] = 'ENVIAgZones';
CUSTOM_TYPE_DISPLAY_NAMES['envicoordsys'] = 'ENVICoordSys';
CUSTOM_TYPE_DISPLAY_NAMES['envideeplearningkerasmodel'] =
  'ENVIDeepLearningKerasModel';
CUSTOM_TYPE_DISPLAY_NAMES['envideeplearninglabelraster'] =
  'ENVIDeepLearningLabelRaster';
CUSTOM_TYPE_DISPLAY_NAMES['envideeplearningobjectdetectionraster'] =
  'ENVIDeepLearningObjectDetectionRaster';
CUSTOM_TYPE_DISPLAY_NAMES['envideeplearningonnxmodel'] =
  'ENVIDeepLearningONNXModel';
CUSTOM_TYPE_DISPLAY_NAMES['envideeplearningraster'] = 'ENVIDeepLearningRaster';
CUSTOM_TYPE_DISPLAY_NAMES['envifeaturecount'] = 'ENVIFeatureCount';
CUSTOM_TYPE_DISPLAY_NAMES['envigcpset'] = 'ENVIGCPSet';
CUSTOM_TYPE_DISPLAY_NAMES['envigeojson'] = 'ENVIGeoJSON';
CUSTOM_TYPE_DISPLAY_NAMES['envigriddefinition'] = 'ENVIGridDefinition';
CUSTOM_TYPE_DISPLAY_NAMES['envimachinelearningmodel'] =
  'ENVIMachineLearningModel';
CUSTOM_TYPE_DISPLAY_NAMES['envipointcloud'] = 'ENVIPointCloud';
CUSTOM_TYPE_DISPLAY_NAMES['envipointcloudbase'] = 'ENVIPointCloud';
CUSTOM_TYPE_DISPLAY_NAMES['envipointcloudproductsinfo'] =
  'ENVIPointCloudProductsInfo';
CUSTOM_TYPE_DISPLAY_NAMES['envipointcloudspatialref'] =
  'ENVIPointCloudSpatialRef';
CUSTOM_TYPE_DISPLAY_NAMES['envipseudorasterspatialref'] =
  'ENVIPseudoRasterSpatialref';
CUSTOM_TYPE_DISPLAY_NAMES['enviraster'] = 'ENVIRaster';
CUSTOM_TYPE_DISPLAY_NAMES['envirasterseries'] = 'ENVIRasterSeries';
CUSTOM_TYPE_DISPLAY_NAMES['enviroi'] = 'ENVIROI';
CUSTOM_TYPE_DISPLAY_NAMES['envirpcrasterspatialref'] =
  'ENVIRPCRasterSpatialref';
CUSTOM_TYPE_DISPLAY_NAMES['envisecurestring'] = 'ENVISecureString';
CUSTOM_TYPE_DISPLAY_NAMES['envispectralindex'] = 'ENVISpectralIndex';
CUSTOM_TYPE_DISPLAY_NAMES['envispectrallibrary'] = 'ENVISpectralLibrary';
CUSTOM_TYPE_DISPLAY_NAMES['envispectralsignature'] = 'ENVISpectralSignature';
CUSTOM_TYPE_DISPLAY_NAMES['envistandardrasterspatialref'] =
  'ENVIStandardRasterSpatialref';
CUSTOM_TYPE_DISPLAY_NAMES['envistretchparameters'] = 'ENVIStretchParameters';
CUSTOM_TYPE_DISPLAY_NAMES['envitiepointset'] = 'ENVITiePointSet';
CUSTOM_TYPE_DISPLAY_NAMES['envitime'] = 'ENVITime';
CUSTOM_TYPE_DISPLAY_NAMES['enviuri'] = 'ENVIURI';
CUSTOM_TYPE_DISPLAY_NAMES['envivector'] = 'ENVIVector';
CUSTOM_TYPE_DISPLAY_NAMES['sarscapedata'] = 'SARscapeData';
