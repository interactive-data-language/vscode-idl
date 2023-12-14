import { ACTIVITY_BAR_ID } from '@idl/shared';
import { existsSync } from 'fs';
import { join } from 'path';

import { IPackageJSON, IPackageNLS } from '../package.interface';

export const ACTIVITY_BAR_ICONS = [
  {
    id: ACTIVITY_BAR_ID,
    title: 'IDL',
    icon: 'extension/images/idlicon.svg',
  },
];

/**
 * Updates the package.json file for our activity bar (sidebar)
 */
export function ProcessActivityBar(
  packageJSON: IPackageJSON,
  nls: IPackageNLS
) {
  // get all of our contribution points
  const contrib = packageJSON['contributes'];

  // verify each theme
  for (let i = 0; i < ACTIVITY_BAR_ICONS.length; i++) {
    const icon = ACTIVITY_BAR_ICONS[i];

    // make sure that the theme file exists
    const url = join(process.cwd(), icon.icon);
    if (!existsSync(url)) {
      throw new Error(
        `activity bar icon at index ${i} missing path file where expected "${icon.icon}"`
      );
    }
  }

  // make sure we have views containers
  if (!('viewsContainers' in contrib)) {
    contrib['viewsContainers'] = {};
  }

  // get our views
  const viewsContainers = contrib['viewsContainers'];

  // made it here so lets update our package file
  viewsContainers['activitybar'] = ACTIVITY_BAR_ICONS;
}
