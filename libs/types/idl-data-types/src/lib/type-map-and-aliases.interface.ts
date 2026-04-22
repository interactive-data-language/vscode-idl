import { IDL_TYPE_LOOKUP, IDLTypes } from './idl-data-types.interface';

/**
 * Maps types that we find in code to known types to normalize what we parse
 * and be less struct about the starting point for user's code.
 *
 * When we serialize, the original types will be the values listed
 * below.
 *
 * User's code will only change if they have AutoDoc enabled with formatting
 */
export const TYPE_MAP_AND_ALIASES: { [key: string]: IDLTypes } = {
  any: IDL_TYPE_LOOKUP.ANY,

  array: IDL_TYPE_LOOKUP.ARRAY,

  arraypromotion: IDL_TYPE_LOOKUP.ARRAY_PROMOTION,

  bigint: IDL_TYPE_LOOKUP.BIG_INTEGER,
  biginteger: IDL_TYPE_LOOKUP.BIG_INTEGER,

  bool: IDL_TYPE_LOOKUP.BOOLEAN,
  boolean: IDL_TYPE_LOOKUP.BOOLEAN,

  byte: IDL_TYPE_LOOKUP.BYTE,

  class: IDL_TYPE_LOOKUP.OBJECT,

  complex: IDL_TYPE_LOOKUP.COMPLEX_FLOAT,
  complexdouble: IDL_TYPE_LOOKUP.COMPLEX_DOUBLE,
  complexfloat: IDL_TYPE_LOOKUP.COMPLEX_FLOAT,
  complexnumber: IDL_TYPE_LOOKUP.COMPLEX_NUMBER,

  dcomplex: IDL_TYPE_LOOKUP.COMPLEX_DOUBLE,

  dict: IDL_TYPE_LOOKUP.DICTIONARY,
  dictionary: IDL_TYPE_LOOKUP.DICTIONARY,

  double: IDL_TYPE_LOOKUP.DOUBLE,
  doublecomplex: IDL_TYPE_LOOKUP.COMPLEX_DOUBLE,

  enviagcrops: 'ENVIAgCrops',

  enviagzones: 'ENVIAgZones',

  envicoordsys: 'ENVICoordSys',

  envideeplearningkerasmodel: 'ENVIDeepLearningKerasModel',

  envideeplearninglabelraster: 'ENVIDeepLearningLabelRaster',

  envideeplearningobjectdetectionraster:
    'ENVIDeepLearningObjectDetectionRaster',

  envideeplearningonnxmodel: 'ENVIDeepLearningONNXModel',

  envideeplearningraster: 'ENVIDeepLearningRaster',

  envifeaturecount: 'ENVIFeatureCount',

  envigcpset: 'ENVIGCPSet',

  envigeojson: 'ENVIGeoJSON',

  envigriddefinition: 'ENVIGridDefinition',

  envimachinelearningmodel: 'ENVIMachineLearningModel',

  envipointcloud: 'ENVIPointCloud',

  envipointcloudbase: 'ENVIPointCloud',

  envipointcloudproductsinfo: 'ENVIPointCloudProductsInfo',

  envipointcloudspatialref: 'ENVIPointCloudSpatialRef',

  envipseudorasterspatialref: 'ENVIPseudoRasterSpatialref',

  enviraster: 'ENVIRaster',

  envirasterseries: 'ENVIRasterSeries',

  enviroi: 'ENVIROI',

  envirpcrasterspatialref: 'ENVIRPCRasterSpatialref',

  envisecurestring: 'ENVISecureString',

  envispectralindex: 'ENVISpectralIndex',

  envispectrallibrary: 'ENVISpectralLibrary',

  envispectralsignature: 'ENVISpectralSignature',

  envistandardrasterspatialref: 'ENVIStandardRasterSpatialref',

  envistretchparameters: 'ENVIStretchParameters',

  envitask: IDL_TYPE_LOOKUP.ENVI_TASK,

  envitiepointset: 'ENVITiePointSet',

  envitime: 'ENVITime',

  enviuri: 'ENVIURI',

  envivector: 'ENVIVector',

  float: IDL_TYPE_LOOKUP.FLOAT,
  float32: IDL_TYPE_LOOKUP.FLOAT,
  float64: IDL_TYPE_LOOKUP.DOUBLE,
  floatcomplex: IDL_TYPE_LOOKUP.COMPLEX_FLOAT,

  hash: IDL_TYPE_LOOKUP.HASH,

  idltask: IDL_TYPE_LOOKUP.IDL_TASK,

  int: IDL_TYPE_LOOKUP.INTEGER,
  integer: IDL_TYPE_LOOKUP.INTEGER,

  list: IDL_TYPE_LOOKUP.LIST,

  long: IDL_TYPE_LOOKUP.LONG,

  long64: IDL_TYPE_LOOKUP.LONG64,

  null: IDL_TYPE_LOOKUP.NULL,

  number: IDL_TYPE_LOOKUP.NUMBER,

  obj: IDL_TYPE_LOOKUP.OBJECT,
  object: IDL_TYPE_LOOKUP.OBJECT,

  orderedhash: IDL_TYPE_LOOKUP.ORDERED_HASH,

  pointer: IDL_TYPE_LOOKUP.POINTER,
  ptr: IDL_TYPE_LOOKUP.POINTER,

  sarscapedata: 'SARscapeData',

  string: IDL_TYPE_LOOKUP.STRING,

  struct: IDL_TYPE_LOOKUP.STRUCTURE,
  structure: IDL_TYPE_LOOKUP.STRUCTURE,

  typeofarg: IDL_TYPE_LOOKUP.TYPE_OF_ARG,

  uint: IDL_TYPE_LOOKUP.UNSIGNED_INTEGER,

  ulong: IDL_TYPE_LOOKUP.UNSIGNED_LONG,

  ulong64: IDL_TYPE_LOOKUP.UNSIGNED_LONG64,

  unsignedint: IDL_TYPE_LOOKUP.UNSIGNED_INTEGER,
  unsignedinteger: IDL_TYPE_LOOKUP.UNSIGNED_INTEGER,

  unsignedlong: IDL_TYPE_LOOKUP.UNSIGNED_LONG,

  unsignedlong64: IDL_TYPE_LOOKUP.UNSIGNED_LONG64,
};
