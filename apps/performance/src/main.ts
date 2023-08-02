import { FindIDL } from '@idl/idl';
import { existsSync } from 'fs';
import { dirname, join } from 'path';

import { ParsingPerformanceRunner } from './parse-tests/parsing-performance-runner';

/**
 * Get the folder that the IDL executable lives in
 */
const IDL = FindIDL();

// validate we found a folder
if (IDL === undefined) {
  throw new Error('Unable to find IDL, required in order to run this app');
}

/**
 * Get the lib folder
 */
const lib = join(dirname(dirname(IDL)), 'lib');

// make sure the lib folder exists
if (!existsSync(lib)) {
  throw new Error(`Lib folder doesn't exist: "${lib}"`);
}

/**
 * Full performance test
 */
ParsingPerformanceRunner(lib, {
  method: 'index-single',
  compression: false,
  multiplier: 1,
  full: true,
  postProcess: true,
  changeDetection: false,
})
  .then(
    () => process.exit(),
    (err) => {
      console.log(err);
      process.exit(1);
    }
  )
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });
