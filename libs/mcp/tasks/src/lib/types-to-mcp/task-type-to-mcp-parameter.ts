import { IDLTypeHelper } from '@idl/parsing/type-parser';
import { IDL_TYPE_LOOKUP, IDLDataType } from '@idl/types/idl-data-types';
import { z } from 'zod';

import { MCP_ENVIAgCrops } from './types/mcp-envi-ag-crops';
import { MCP_ENVIAgZones } from './types/mcp-envi-ag-zones';
import { MCP_ENVICoordSys } from './types/mcp-envi-coord-sys';
import { MCP_ENVIDeepLearningKerasModel } from './types/mcp-envi-deep-learning-keras-model';
import { MCP_ENVIDeepLearningLabelRaster } from './types/mcp-envi-deep-learning-label-raster';
import { MCP_ENVIDeepLearningObjectDetectionRaster } from './types/mcp-envi-deep-learning-object-detection-raster';
import { MCP_ENVIDeepLearningONNXModel } from './types/mcp-envi-deep-learning-onnx-model';
import { MCP_ENVIDeepLearningRaster } from './types/mcp-envi-deep-learning-raster';
import { MCP_ENVIGeoJSON } from './types/mcp-envi-geojson';
import { MCP_ENVIGridDefinition } from './types/mcp-envi-grid-definition';
import { MCP_ENVIMachineLearningModel } from './types/mcp-envi-machine-learning-model';
import { MCP_ENVIPointCloud } from './types/mcp-envi-point-cloud';
import { MCP_ENVIPseudoRasterSpatialref } from './types/mcp-envi-pseudo-raster-spatialref';
import { MCP_ENVIRaster } from './types/mcp-envi-raster';
import { MCP_ENVIRasterSeries } from './types/mcp-envi-raster-series';
import { MCP_ENVIROI } from './types/mcp-envi-roi';
import { MCP_ENVIRPCRasterSpatialref } from './types/mcp-envi-rpc-raster-spatialref';
import { MCP_ENVISpectralLibrary } from './types/mcp-envi-spectral-library';
import { MCP_ENVISpectralSignature } from './types/mcp-envi-spectral-signature';
import { MCP_ENVIStandardRasterSpatialref } from './types/mcp-envi-standard-raster-spatialref';
import { MCP_ENVIStretchParameters } from './types/mcp-envi-stretch-parameters';
import { MCP_ENVITiePointSet } from './types/mcp-envi-tie-point-set';
import { MCP_ENVITime } from './types/mcp-envi-time';
import { MCP_ENVIVector } from './types/mcp-envi-vector';
import { MCP_SARscapeData } from './types/mcp-sarscape-data';

/**
 * Converts a task type to the MCP Parameter
 */
export function TaskTypeToMCPParameter(
  name: string,
  docs: string,
  type: IDLDataType
) {
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

      /** Attempt to map our parameter */
      const arrayType = TaskTypeToMCPParameter(name, '', typeArgs);

      // see if we mapped a parameter or not
      if (arrayType) {
        return z.array(arrayType).describe(docs);
      }

      break;
    }

    /**
     * ENVI URI - Folder
     */
    case type[0].meta.isUri && type[0].meta.isFolder:
      return z
        .string()
        .default('!')
        .describe(
          'Fully-qualified path to the output folder, default is "!" which indicates a temporary location will be created. Only set this when requested by user.'
        );

    /**
     * ENVI URI - Folder
     */
    case type[0].meta.isUri:
      return z
        .string()
        .default('!')
        .describe(
          'Fully-qualified path to the output dataset, default is "!" which indicates a temporary file will be created. Only set this when requested by user.'
        );

    /**
     * Any type of spatial reference
     */
    case IDLTypeHelper.isType(type, '_envispatialref'):
      return z
        .union([
          MCP_ENVIPseudoRasterSpatialref(''),
          MCP_ENVIRPCRasterSpatialref(''),
          MCP_ENVIStandardRasterSpatialref(''),
        ])
        .describe(`${docs}\n\nSpecify one of the types of spatial references.`);

    /**
     * Crop counting results
     */
    case IDLTypeHelper.isType(type, 'enviagcrops'):
      return MCP_ENVIAgCrops(docs);

    /**
     * Field zones
     */
    case IDLTypeHelper.isType(type, 'enviagzones'):
      return MCP_ENVIAgZones(docs);

    /**
     * Coordinate system
     */
    case IDLTypeHelper.isType(type, 'envicoordsys'):
      return MCP_ENVICoordSys(docs);

    /**
     * Deep Learning Keras model
     */
    case IDLTypeHelper.isType(type, 'envideeplearningkerasmodel'):
      return MCP_ENVIDeepLearningKerasModel(docs);

    /**
     * Deep Learning Label Raster for Pixel training
     */
    case IDLTypeHelper.isType(type, 'envideeplearninglabelraster'):
      return MCP_ENVIDeepLearningLabelRaster(docs);

    /**
     * Deep Learning raster for OD training
     */
    case IDLTypeHelper.isType(type, 'envideeplearningobjectdetectionraster'):
      return MCP_ENVIDeepLearningObjectDetectionRaster(docs);

    /**
     * Deep Learning ONNX model
     */
    case IDLTypeHelper.isType(type, 'envideeplearningonnxmodel'):
      return MCP_ENVIDeepLearningONNXModel(docs);

    /**
     * Deep Learning Label Raster for Pixel training
     */
    case IDLTypeHelper.isType(type, 'envideeplearningraster'):
      return MCP_ENVIDeepLearningRaster(docs);

    /**
     * GeoJSON
     */
    case IDLTypeHelper.isType(type, 'envigeojson'):
      return MCP_ENVIGeoJSON(docs);

    /**
     * GridDefinitions
     */
    case IDLTypeHelper.isType(type, 'envigriddefinition'):
      return MCP_ENVIGridDefinition(docs);

    /**
     * Machine Learning model
     */
    case IDLTypeHelper.isType(type, 'envimachinelearningmodel'):
      return MCP_ENVIMachineLearningModel(docs);

    /**
     * Point cloud
     */
    case IDLTypeHelper.isType(type, 'envipointcloudbase'):
    case IDLTypeHelper.isType(type, 'envipointcloud'):
      return MCP_ENVIPointCloud(docs);

    /**
     * ENVI pseudo raster spatial ref
     */
    case IDLTypeHelper.isType(type, 'envipseudorasterspatialref'):
      return MCP_ENVIPseudoRasterSpatialref(docs);

    /**
     * Raster
     */
    case IDLTypeHelper.isType(type, 'enviraster'):
      return MCP_ENVIRaster(docs);

    /**
     * Raster series
     */
    case IDLTypeHelper.isType(type, 'envirasterseries'):
      return MCP_ENVIRasterSeries(docs);

    /**
     * ROI
     */
    case IDLTypeHelper.isType(type, 'enviroi'):
      return MCP_ENVIROI(docs);

    /**
     * RPC spatial ref
     */
    case IDLTypeHelper.isType(type, 'envirpcrasterspatialref'):
      return MCP_ENVIRPCRasterSpatialref(docs);

    /**
     * Passwords - map to proper parameters when we
     * run the task
     */
    case IDLTypeHelper.isType(type, 'envisecurestring'):
      return z.string().describe(docs);

    /**
     * ENVI spectral index
     */
    case IDLTypeHelper.isType(type, 'envispectralindex'):
      return z.string().describe(docs);

    /**
     * ENVI spectral library
     */
    case IDLTypeHelper.isType(type, 'envispectrallibrary'):
      return MCP_ENVISpectralLibrary(docs);

    /**
     * ENVI Spectral Signature
     */
    case IDLTypeHelper.isType(type, 'envispectralsignature'):
      return MCP_ENVISpectralSignature(docs);

    /**
     * Standard spatial ref
     */
    case IDLTypeHelper.isType(type, 'envistandardrasterspatialref'):
      return MCP_ENVIStandardRasterSpatialref(docs);

    /**
     * Stretch parameters
     */
    case IDLTypeHelper.isType(type, 'envistretchparameters'):
      return MCP_ENVIStretchParameters(docs);

    /**
     * Tie points
     */
    case IDLTypeHelper.isType(type, 'envitiepointset'):
      return MCP_ENVITiePointSet(docs);

    /**
     * Time
     */
    case IDLTypeHelper.isType(type, 'envitime'):
      return MCP_ENVITime(docs);

    /**
     * Vector
     */
    case IDLTypeHelper.isType(type, 'envivector'):
      return MCP_ENVIVector(docs);

    /**
     * SARscapeData -
     */
    case IDLTypeHelper.isType(type, 'sarscapedata'):
      return MCP_SARscapeData(docs);

    /**
     * String
     */
    case IDLTypeHelper.isType(type, IDL_TYPE_LOOKUP.STRING):
      // check for values from a choice list and map to literals
      if (type[0]?.value?.length > 0) {
        try {
          return z
            .union(type[0].value.map((v) => z.literal(v)) as any)
            .describe(docs);
        } catch (err) {
          console.log(`Error while enumerating literal string types`, {
            type,
            err,
          });
          return z.string().describe(docs);
        }
      } else {
        return z.string().describe(docs);
      }

    /**
     * Bool
     */
    case IDLTypeHelper.isType(type, IDL_TYPE_LOOKUP.BOOLEAN):
      return z.boolean().describe(docs);

    /**
     * List
     */
    case IDLTypeHelper.isType(type, IDL_TYPE_LOOKUP.LIST):
      return z.array(z.any()).describe(docs);

    /**
     * Objects/hashes
     */
    case IDLTypeHelper.isType(type, IDL_TYPE_LOOKUP.HASH):
    case IDLTypeHelper.isType(type, IDL_TYPE_LOOKUP.ORDERED_HASH):
    case IDLTypeHelper.isType(type, IDL_TYPE_LOOKUP.DICTIONARY):
      return z.record(z.any()).describe(docs);

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
      /**
       * Attempt to convert choice list to literal numbers as we
       * store literal numbers as strings (from parsing)
       */
      if (type[0]?.value?.length > 0) {
        try {
          return z
            .union(type[0].value.map((v) => z.literal(+v)) as any)
            .describe(docs);
        } catch (err) {
          console.log(`Error while enumerating literal number types`, {
            type,
            err,
          });
          return z.number().describe(docs);
        }
      } else {
        return z.number().describe(docs);
      }

    default:
      break;
  }
}
