import { readFileSync } from 'fs';
import { join } from 'path';

import { IPackageNLS } from './package.interface';

/** Path to package.json */
export const PACKAGE_URI = join(process.cwd(), 'package.json');

/** Path to package.nls.json */
export const PACKAGE_NLS_URI = join(process.cwd(), 'package.nls.json');

// load in our package JSON and nls file
export const json = JSON.parse(readFileSync(PACKAGE_URI, 'utf-8'));

/**
 * Translation file
 */
export const NLS: IPackageNLS = JSON.parse(
  readFileSync(PACKAGE_NLS_URI, 'utf-8')
);
