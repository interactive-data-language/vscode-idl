import { ParseIDLType } from '@idl/data-types/core';

import { OverrideParamOrProp } from './shared.interface';

export interface ISharedOverrides {
  /** Spatial ref for rasters */
  SPATIALREF: OverrideParamOrProp;
  /** interleave for rasters */
  INTERLEAVE: OverrideParamOrProp;
}

/**
 * Data types that we re-use for easier access and less to copy/paste
 */
export const SHARED_OVERRIDES: ISharedOverrides = {
  SPATIALREF: {
    type: ParseIDLType(
      `ENVIStandardRasterSpatialRef | ENVIRPCRasterSpatialRef | ENVIPseudoRasterSpatialRef | ENVIGLTRasterSpatialRef `
    ),
  },
  INTERLEAVE: { type: ParseIDLType(`string`) },
};
