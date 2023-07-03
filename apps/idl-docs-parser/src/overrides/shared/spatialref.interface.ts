import { ParseIDLType } from '@idl/data-types/core';

/**
 * Data type for spatial references
 */
export const SPATIALREF_TYPE = ParseIDLType(
  `ENVIStandardRasterSpatialRef | ENVIRPCRasterSpatialRef | ENVIPseudoRasterSpatialRef | ENVIGLTRasterSpatialRef | ENVINITFCSMRasterSpatialRef`
);
