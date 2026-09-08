import { IDLTypeHelper } from '@idl/parsing/type-parser';

/**
 * Data type for spatial references
 */
export const SPATIALREF_TYPE = IDLTypeHelper.parseIDLType(
  `ENVIStandardRasterSpatialRef | ENVIRPCRasterSpatialRef | ENVIPseudoRasterSpatialRef | ENVIGLTRasterSpatialRef | ENVINITFCSMRasterSpatialRef`,
);
