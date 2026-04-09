import {
  MCP_ENVIAgCrops,
  MCP_ENVIAgZones,
  MCP_ENVICoordSys,
  MCP_ENVIDeepLearningKerasModel,
  MCP_ENVIDeepLearningLabelRaster,
  MCP_ENVIDeepLearningObjectDetectionRaster,
  MCP_ENVIDeepLearningONNXModel,
  MCP_ENVIDeepLearningRaster,
  MCP_ENVIFeatureCount,
  MCP_ENVIGCPSet,
  MCP_ENVIGeoJSON,
  MCP_ENVIGridDefinition,
  MCP_ENVIMachineLearningModel,
  MCP_ENVIPointCloud,
  MCP_ENVIPointCloudProductsInfo,
  MCP_ENVIPointCloudSpatialRef,
  MCP_ENVIPseudoRasterSpatialref,
  MCP_ENVIRaster,
  MCP_ENVIRasterSeries,
  MCP_ENVIROI,
  MCP_ENVIRPCRasterSpatialref,
  MCP_ENVISecureString,
  MCP_ENVISpatialref,
  MCP_ENVISpectralIndex,
  MCP_ENVISpectralLibrary,
  MCP_ENVISpectralSignature,
  MCP_ENVIStandardRasterSpatialref,
  MCP_ENVIStretchParameters,
  MCP_ENVITiePointSet,
  MCP_ENVITime,
  MCP_ENVIURI,
  MCP_ENVIVariant,
  MCP_ENVIVector,
  MCP_SARscapeData,
} from '@idl/mcp/envi-to-mcp';
import { IDLTypeHelper } from '@idl/parsing/type-parser';
import {
  IDL_TYPE_LOOKUP,
  IDLDataType,
  IParameterOrPropertyDetails,
} from '@idl/types/idl-data-types';
import { z } from 'zod';

import { MCP_Boolean } from './types/mcp-boolean';
import { MCP_List } from './types/mcp-list';
import { MCP_Number } from './types/mcp-number';
import { MCP_Object } from './types/mcp-object';
import { MCP_String } from './types/mcp-string';

/**
 * Actually convert our parameter to an MCP parameter
 *
 * This recurses if we have an array, can be updated to manage
 * multiple types like we get from IDL code.
 */
function IDLParameterToMCPParameter_Recurser(
  param: IParameterOrPropertyDetails,
  cleanDocs: string,
  type?: IDLDataType,
) {
  // default type if it wasn't specified
  if (!type) {
    type = param.type;
  }

  /** Extract the first type */
  const firstType = type[0];

  /** Initialize return value */
  let res: z.ZodType;

  /**
   * Convert to ZOD
   */
  switch (true) {
    /**
     * Handle arrays of values and recurse
     */
    case IDLTypeHelper.isType(type, IDL_TYPE_LOOKUP.ARRAY): {
      /** Get type arguments for arrays (i.e. Array<TypeArg>) */
      const typeArgs = IDLTypeHelper.getAllTypeArgs(type);

      /** Attempt to map our parameter - dont pass in docs, set below */
      const arrayType = IDLParameterToMCPParameter_Recurser(
        param,
        '',
        typeArgs,
      );

      // see if we mapped a parameter or not
      if (arrayType) {
        /** Check for dimensions */
        const dims = type[0].meta.dimensions || ['*'];

        // init res with the array type
        res = arrayType;

        /**
         * Populate the dimension
         *
         * Note that this *REVERSES* the dimension order from IDL because
         * we set the innermost dimension to the outermost which changes
         * the row/column major-ness from IDL and JS
         *
         * In IDL we also have a transpose from list to array to match what IDL
         * expects.
         */
        for (let g = 0; g < dims.length; g++) {
          if (dims[g] === '*') {
            res = z.array(res);
          } else {
            res = z.array(res).length(dims[g] as number);
          }
        }
      }
      break;
    }

    /**
     * ENVI URI - Folder
     */
    case firstType.meta.isUri && firstType.meta.isFolder:
      res = MCP_ENVIURI();
      cleanDocs =
        'Fully-qualified path to the output folder, default is "!" which indicates a temporary location will be created. Only set this when requested by user. If this is an output parameter, it MUST not be set to an existing folder on disk. You may need to examine the output location to find specific datasets.';
      break;

    /**
     * ENVI URI - Folder
     */
    case firstType.meta.isUri:
      res = MCP_ENVIURI();
      cleanDocs =
        'Fully-qualified path to the output dataset, default is "!" which indicates a temporary file will be created. Only set this when requested by user. If this is an output parameter, it MUST not be set to an existing file on disk.';
      break;

    /**
     * Any type of spatial reference
     */
    case IDLTypeHelper.isType(type, '_envispatialref'):
      res = MCP_ENVISpatialref();
      break;

    /**
     * Crop counting results
     */
    case IDLTypeHelper.isType(type, 'enviagcrops'):
      res = MCP_ENVIAgCrops();
      break;

    /**
     * Field zones
     */
    case IDLTypeHelper.isType(type, 'enviagzones'):
      res = MCP_ENVIAgZones();
      break;

    /**
     * Coordinate system
     */
    case IDLTypeHelper.isType(type, 'envicoordsys'):
      res = MCP_ENVICoordSys();
      break;

    /**
     * Deep Learning Keras model
     */
    case IDLTypeHelper.isType(type, 'envideeplearningkerasmodel'):
      res = MCP_ENVIDeepLearningKerasModel();
      break;

    /**
     * Deep Learning Label Raster for Pixel training
     */
    case IDLTypeHelper.isType(type, 'envideeplearninglabelraster'):
      res = MCP_ENVIDeepLearningLabelRaster();
      break;

    /**
     * Deep Learning raster for OD training
     */
    case IDLTypeHelper.isType(type, 'envideeplearningobjectdetectionraster'):
      res = MCP_ENVIDeepLearningObjectDetectionRaster();
      break;

    /**
     * Deep Learning ONNX model
     */
    case IDLTypeHelper.isType(type, 'envideeplearningonnxmodel'):
      res = MCP_ENVIDeepLearningONNXModel();
      break;

    /**
     * Deep Learning Label Raster for Pixel training
     */
    case IDLTypeHelper.isType(type, 'envideeplearningraster'):
      res = MCP_ENVIDeepLearningRaster();
      break;

    /**
     * GCP Set
     */
    case IDLTypeHelper.isType(type, 'envigcpset'):
      res = MCP_ENVIGCPSet();
      break;

    /**
     * GeoJSON
     */
    case IDLTypeHelper.isType(type, 'envigeojson'):
      res = MCP_ENVIGeoJSON();
      break;

    /**
     * GridDefinitions
     */
    case IDLTypeHelper.isType(type, 'envigriddefinition'):
      res = MCP_ENVIGridDefinition();
      break;

    /**
     * FeatureCount
     */
    case IDLTypeHelper.isType(type, 'envifeaturecount'):
      res = MCP_ENVIFeatureCount();
      break;

    /**
     * Machine Learning model
     */
    case IDLTypeHelper.isType(type, 'envimachinelearningmodel'):
      res = MCP_ENVIMachineLearningModel();
      break;

    /**
     * Point cloud
     */
    case IDLTypeHelper.isType(type, 'envipointcloudbase'):
    case IDLTypeHelper.isType(type, 'envipointcloud'):
      res = MCP_ENVIPointCloud();
      break;

    /**
     * Point cloud product info
     */
    case IDLTypeHelper.isType(type, 'envipointcloudproductsinfo'):
      res = MCP_ENVIPointCloudProductsInfo();
      break;

    /**
     * Point cloud spatial reference
     */
    case IDLTypeHelper.isType(type, 'envipointcloudspatialref'):
      res = MCP_ENVIPointCloudSpatialRef();
      break;

    /**
     * ENVI pseudo raster spatial ref
     */
    case IDLTypeHelper.isType(type, 'envipseudorasterspatialref'):
      res = MCP_ENVIPseudoRasterSpatialref();
      break;

    /**
     * Raster
     */
    case IDLTypeHelper.isType(type, 'enviraster'):
      res = MCP_ENVIRaster();
      break;

    /**
     * Raster series
     */
    case IDLTypeHelper.isType(type, 'envirasterseries'):
      res = MCP_ENVIRasterSeries();
      break;

    /**
     * ROI
     */
    case IDLTypeHelper.isType(type, 'enviroi'):
      res = MCP_ENVIROI();
      break;

    /**
     * RPC spatial ref
     */
    case IDLTypeHelper.isType(type, 'envirpcrasterspatialref'):
      res = MCP_ENVIRPCRasterSpatialref();
      break;

    /**
     * Passwords - map to proper parameters when we
     * run the task
     */
    case IDLTypeHelper.isType(type, 'envisecurestring'):
      res = MCP_ENVISecureString();
      break;

    /**
     * ENVI spectral index
     */
    case IDLTypeHelper.isType(type, 'envispectralindex'):
      res = MCP_ENVISpectralIndex();
      break;

    /**
     * ENVI spectral library
     */
    case IDLTypeHelper.isType(type, 'envispectrallibrary'):
      res = MCP_ENVISpectralLibrary();
      break;

    /**
     * ENVI Spectral Signature
     */
    case IDLTypeHelper.isType(type, 'envispectralsignature'):
      res = MCP_ENVISpectralSignature();
      break;

    /**
     * Standard spatial ref
     */
    case IDLTypeHelper.isType(type, 'envistandardrasterspatialref'):
      res = MCP_ENVIStandardRasterSpatialref();
      break;

    /**
     * Stretch parameters
     */
    case IDLTypeHelper.isType(type, 'envistretchparameters'):
      res = MCP_ENVIStretchParameters();
      break;

    /**
     * Tie points
     */
    case IDLTypeHelper.isType(type, 'envitiepointset'):
      res = MCP_ENVITiePointSet();
      break;

    /**
     * Time
     */
    case IDLTypeHelper.isType(type, 'envitime'):
      res = MCP_ENVITime();
      break;

    /**
     * Variant (i.e. publish to repo)
     */
    case IDLTypeHelper.isType(type, 'variant'):
      res = MCP_ENVIVariant();
      break;

    /**
     * Vector
     */
    case IDLTypeHelper.isType(type, 'envivector'):
      res = MCP_ENVIVector();
      break;

    /**
     * SARscapeData -
     */
    case IDLTypeHelper.isType(type, 'sarscapedata'):
      res = MCP_SARscapeData();
      break;

    /**
     * String
     */
    case IDLTypeHelper.isType(type, IDL_TYPE_LOOKUP.STRING):
      res = MCP_String(firstType?.value);
      break;

    /**
     * Bool
     */
    case IDLTypeHelper.isType(type, IDL_TYPE_LOOKUP.BOOLEAN):
      res = MCP_Boolean();
      break;

    /**
     * List
     *
     * TODO: Get actual types for literal arguments
     */
    case IDLTypeHelper.isType(type, IDL_TYPE_LOOKUP.LIST):
      res = MCP_List();
      break;

    /**
     * Objects/hashes
     */
    case IDLTypeHelper.isType(type, IDL_TYPE_LOOKUP.HASH):
    case IDLTypeHelper.isType(type, IDL_TYPE_LOOKUP.ORDERED_HASH):
    case IDLTypeHelper.isType(type, IDL_TYPE_LOOKUP.DICTIONARY):
      res = MCP_Object();
      break;

    /**
     * Numbers
     */
    case IDLTypeHelper.isType(type, IDL_TYPE_LOOKUP.NUMBER):
    case IDLTypeHelper.isType(type, IDL_TYPE_LOOKUP.BIG_INTEGER):
    case IDLTypeHelper.isType(type, IDL_TYPE_LOOKUP.DOUBLE):
    case IDLTypeHelper.isType(type, IDL_TYPE_LOOKUP.FLOAT):
    case IDLTypeHelper.isType(type, IDL_TYPE_LOOKUP.UNSIGNED_LONG64):
    case IDLTypeHelper.isType(type, IDL_TYPE_LOOKUP.LONG64):
    case IDLTypeHelper.isType(type, IDL_TYPE_LOOKUP.UNSIGNED_LONG):
    case IDLTypeHelper.isType(type, IDL_TYPE_LOOKUP.LONG):
    case IDLTypeHelper.isType(type, IDL_TYPE_LOOKUP.UNSIGNED_INTEGER):
    case IDLTypeHelper.isType(type, IDL_TYPE_LOOKUP.INTEGER):
    case IDLTypeHelper.isType(type, IDL_TYPE_LOOKUP.BYTE):
      res = MCP_Number(firstType.value, firstType.meta.min, firstType.meta.max);
      break;

    default:
      break;
  }

  /**
   * Populate some additional root-level properties based on the first type
   * metadata and parameter docs
   */
  if (res) {
    // check for default
    if (typeof firstType.meta.default !== 'undefined') {
      res = res.default(firstType.meta.default);
    }

    // add description if we have one
    const trimmed = cleanDocs.trim();
    if (trimmed) {
      res = res.describe(trimmed);
    }
  }

  return res;
}

/**
 * Converts a parameter to an MCP Parameter
 *
 * Assumes that we only have one type for the input parameter because
 * that's what we have for tasks.
 *
 * Could be updated to support any IDL type with unions and iterating
 * through all possible types, but we don't need that right now.
 */
export function IDLParameterToMCPParameter(
  param: IParameterOrPropertyDetails,
  cleanDocs: string,
  type?: IDLDataType,
): z.ZodType {
  /**
   * Recurse into the data type and populate
   */
  let res = IDLParameterToMCPParameter_Recurser(param, cleanDocs, type);

  // set as optional if not required
  if (res) {
    if (!param.req) {
      res = res.optional();
    }
  }

  return res;
}
