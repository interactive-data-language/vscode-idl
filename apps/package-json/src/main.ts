import { VERSION } from '@idl/shared';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

import { ProcessPackage } from './process-package';

/** Path to package.json */
export const PACKAGE_URI = join(process.cwd(), 'package.json');

/** Path to package.nls.json */
export const PACKAGE_NLS_URI = join(process.cwd(), 'package.nls.json');

// load in our package JSON and nls file
const json = JSON.parse(readFileSync(PACKAGE_URI, 'utf-8'));
const nls = JSON.parse(readFileSync(PACKAGE_NLS_URI, 'utf-8'));

// make our package.json file
ProcessPackage(json, nls)
  .then(() => {
    // set the version
    json['version'] = VERSION;

    // write our changes back to disk - extra line for linting
    writeFileSync(PACKAGE_URI, JSON.stringify(json, null, 2) + '\n');
  })
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });
