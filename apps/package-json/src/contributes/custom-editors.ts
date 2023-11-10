import { ENVI_OPENER_TYPE } from '@idl/shared';

import { IPackageJSON, IPackageNLS } from '../package.interface';
import { VerifyNLS } from './helpers/verify-nls';

/**
 * Base configuration for our ENVI file opener/wrapper.
 */
const ENVI_OPENER_CONFIG = {
  viewType: ENVI_OPENER_TYPE,
  displayName: '%envi.openerTitle%',
  selector: [],
  priority: 'option',
};

/**
 * File extensions that we want to register to our ENVI opener
 */
const FILE_EXTENSIONS = [
  `dat`,
  `tif`,
  `tiff`,
  `jp2`,
  `jp2000`,
  `ntf`,
  `nitf`,
  `r0`,
].sort();

/**
 * Updates the package.json file for our themes and makes sure everything exists
 */
export function ProcessCustomEditors(
  packageJSON: IPackageJSON,
  nls: IPackageNLS
) {
  // get all of our contribution points
  const contrib = packageJSON['contributes'];

  // make sure that our translation is correct
  if (!VerifyNLS(ENVI_OPENER_CONFIG.displayName, nls)) {
    throw new Error(
      `ENVI file opener invalid displayName of "${ENVI_OPENER_CONFIG.displayName}"`
    );
  }

  // add each extension
  for (let i = 0; i < FILE_EXTENSIONS.length; i++) {
    // add extension that we support
    ENVI_OPENER_CONFIG.selector.push({
      filenamePattern: `*.${FILE_EXTENSIONS[i]}`,
    });
  }

  // made it here so lets update our package file
  contrib['customEditors'] = [ENVI_OPENER_CONFIG];

  // handled automatically. if included, gets yellow tooltip in package.json
  // packageJSON['activationEvents'].push(`onCustomEditor:${ENVI_OPENER_TYPE}`);
}
