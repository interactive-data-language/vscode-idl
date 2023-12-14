import { ACTIVITY_BAR_ID, IDL_TREE_VIEW_ID } from '@idl/shared';

import { IPackageJSON, IPackageNLS } from '../package.interface';
import { VerifyNLS } from './helpers/verify-nls';

export const IDL_TREE_VIEW = {
  id: IDL_TREE_VIEW_ID,
  name: '%idl.tree.name%',
};

/**
 * Updates the package.json file to support our tree view
 */
export function ProcessTreeView(packageJSON: IPackageJSON, nls: IPackageNLS) {
  // not needed per https://code.visualstudio.com/updates/v1_74#_extension-authoring
  // packageJSON['activationEvents'].push(`onView:${IDL_TREE_VIEW_ID}`);

  // get all of our contribution points
  const contrib = packageJSON['contributes'];

  // make sure we have views containers
  if (!('views' in contrib)) {
    contrib['views'] = {};
  }

  // get our views
  const views = contrib['views'];

  // made it here so lets update our package file
  views[ACTIVITY_BAR_ID] = [IDL_TREE_VIEW];

  // make sure our translation is good
  if (!VerifyNLS(IDL_TREE_VIEW.name, nls)) {
    throw new Error('Missing/bad translation for tree view');
  }
}
