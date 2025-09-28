import { ParseIDLType } from '@idl/types/idl-data-types';

/**
 * Data type for spatial references
 */
export const SPATIALREF_TYPE = ParseIDLType(
  `ENVIStandardRasterSpatialRef | ENVIRPCRasterSpatialRef | ENVIPseudoRasterSpatialRef | ENVIGLTRasterSpatialRef | ENVINITFCSMRasterSpatialRef`
);
