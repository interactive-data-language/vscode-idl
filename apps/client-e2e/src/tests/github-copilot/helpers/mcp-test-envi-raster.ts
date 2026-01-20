import { join } from 'path';

import { IDL_DIR } from './../../../main';

/**
 * Dehydrated test raster for processing
 */
export const MCP_TEST_ENVI_RASTER = {
  factory: 'URLRaster',
  uri: join(IDL_DIR, 'data', 'qb_boulder_msi'),
  auxiliary_url: [join(IDL_DIR, 'data', 'qb_boulder_msi.hdr')],
};
