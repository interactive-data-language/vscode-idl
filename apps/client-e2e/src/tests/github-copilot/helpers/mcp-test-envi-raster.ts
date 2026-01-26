import { basename, dirname, join } from 'path';

import { IDL_DIR } from './../../../main';

/**
 * Gets ENVI's root folder and throws an error if IDL is not installed under ENVI
 */
function GetENVIDir() {
  /** If ENVI + IDL, go up 3 folders from the bin directory */
  const enviDir = dirname(dirname(dirname(IDL_DIR)));

  // make sure we have ENVI install location
  if (!basename(enviDir).toLowerCase().startsWith('envi')) {
    throw new Error('ENVI not installed');
  }

  // return the folder ENVI is in
  return enviDir;
}

/**
 * Returns a test ENVI raster
 */
export function MCPTestENVIRaster() {
  /** Get ENVI install */
  const envi = GetENVIDir();

  // return QB boulder
  return {
    factory: 'URLRaster',
    url: join(envi, 'data', 'qb_boulder_msi'),
    auxiliary_url: [join(envi, 'data', 'qb_boulder_msi.hdr')],
  };
}
