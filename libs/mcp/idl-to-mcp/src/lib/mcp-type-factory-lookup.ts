import {
  MCP_ENVIAgCrops,
  MCP_ENVIAgZones,
  MCP_ENVIAnnotationSet,
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
  MCP_ENVIVariant,
  MCP_ENVIVector,
  MCP_SARscapeData,
} from '@idl/mcp/envi-to-mcp';
import { IDLDataTypeBase, IDLTypes } from '@idl/types/idl-data-types';
import { z } from 'zod';

import { MCP_Boolean } from './types/mcp-boolean';
import { MCP_List } from './types/mcp-list';
import { MCP_Object } from './types/mcp-object';
import { MCP_String } from './types/mcp-string';

/**
 * Signature for a factory that converts a single IDL data type entry into
 * a Zod schema used by an MCP tool parameter.
 *
 * The `entry` argument carries `value` (literal values) and `meta` (min, max,
 * dimensions, defaults, etc.) so factories can read per-entry information when
 * needed. Most ENVI factories ignore it and return a fixed schema.
 */
export type MCPFactory = (type: IDLDataTypeBase<IDLTypes>) => z.ZodType;

/**
 * Lookup of IDL type name (lowercase) to MCP Zod factory.
 *
 * Add new ENVI / IDL types here alphabetically. The key MUST be the lowercase
 * IDL type name; matching is case-insensitive to mirror `IDLTypeHelper.isType`.
 *
 * Base types (those that start with an underscore, e.g. `_envispatialref`)
 * keep the leading underscore in the key.
 */
export const MCP_TYPE_FACTORIES: Record<string, MCPFactory> = {
  boolean: () => MCP_Boolean(),
  _envispatialref: () => MCP_ENVISpatialref(),
  enviagcrops: () => MCP_ENVIAgCrops(),
  enviagzones: () => MCP_ENVIAgZones(),
  enviannotationset: () => MCP_ENVIAnnotationSet(),
  envicoordsys: () => MCP_ENVICoordSys(),
  envideeplearningkerasmodel: () => MCP_ENVIDeepLearningKerasModel(),
  envideeplearninglabelraster: () => MCP_ENVIDeepLearningLabelRaster(),
  envideeplearningobjectdetectionraster: () =>
    MCP_ENVIDeepLearningObjectDetectionRaster(),
  envideeplearningonnxmodel: () => MCP_ENVIDeepLearningONNXModel(),
  envideeplearningraster: () => MCP_ENVIDeepLearningRaster(),
  envifeaturecount: () => MCP_ENVIFeatureCount(),
  envigcpset: () => MCP_ENVIGCPSet(),
  envigeojson: () => MCP_ENVIGeoJSON(),
  envigriddefinition: () => MCP_ENVIGridDefinition(),
  envimachinelearningmodel: () => MCP_ENVIMachineLearningModel(),
  envipointcloud: () => MCP_ENVIPointCloud(),
  envipointcloudbase: () => MCP_ENVIPointCloud(),
  envipointcloudproductsinfo: () => MCP_ENVIPointCloudProductsInfo(),
  envipointcloudspatialref: () => MCP_ENVIPointCloudSpatialRef(),
  envipseudorasterspatialref: () => MCP_ENVIPseudoRasterSpatialref(),
  enviraster: () => MCP_ENVIRaster(),
  envirasterseries: () => MCP_ENVIRasterSeries(),
  enviroi: () => MCP_ENVIROI(),
  envirpcrasterspatialref: () => MCP_ENVIRPCRasterSpatialref(),
  envisecurestring: () => MCP_ENVISecureString(),
  envispectralindex: () => MCP_ENVISpectralIndex(),
  envispectrallibrary: () => MCP_ENVISpectralLibrary(),
  envispectralsignature: () => MCP_ENVISpectralSignature(),
  envistandardrasterspatialref: () => MCP_ENVIStandardRasterSpatialref(),
  envistretchparameters: () => MCP_ENVIStretchParameters(),
  envitiepointset: () => MCP_ENVITiePointSet(),
  envitime: () => MCP_ENVITime(),
  envivector: () => MCP_ENVIVector(),
  dictionary: () => MCP_Object(),
  hash: () => MCP_Object(),
  list: () => MCP_List(),
  orderedhash: () => MCP_Object(),
  sarscapedata: () => MCP_SARscapeData(),
  string: (type) => MCP_String(type?.value),
  variant: () => MCP_ENVIVariant(),
};
