import { existsSync } from 'fs';
import { join } from 'path';

import { IPackageJSON, IPackageNLS } from '../package.interface';
import { VerifyNLS } from './helpers/verify-nls';

export const THEMES = [
  {
    label: '%themes.new%',
    uiTheme: 'vs-dark',
    path: 'extension/language/themes/novus.json',
  },
  {
    label: '%themes.neon%',
    uiTheme: 'vs-dark',
    path: 'extension/language/themes/neon.json',
  },
  // {
  //   label: '%themes.magmatic%',
  //   uiTheme: 'vs-dark',
  //   path: 'extension/language/themes/magmatic.json',
  // },
  {
    label: '%themes.retro%',
    uiTheme: 'vs',
    path: 'extension/language/themes/retro.json',
  },
];

/**
 * Updates the package.json file for our themes and makes sure everything exists
 */
export function ProcessThemes(packageJSON: IPackageJSON, nls: IPackageNLS) {
  // get all of our contribution points
  const contrib = packageJSON['contributes'];

  // verify each theme
  for (let i = 0; i < THEMES.length; i++) {
    const theme = THEMES[i];

    // make sure that our translation is correct
    if (!VerifyNLS(theme.label, nls)) {
      throw new Error(
        `Theme at index ${i} has an invalid label of "${theme.label}"`
      );
    }

    // make sure that the theme file exists
    const themeUri = join(process.cwd(), theme.path);
    if (!existsSync(themeUri)) {
      throw new Error(
        `Theme at index ${i} missing path file where expected "${theme.label}"`
      );
    }
  }

  // made it here so lets update our package file
  contrib['themes'] = THEMES;
}
