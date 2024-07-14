import { VERSION } from '@idl/shared';
import { writeFileSync } from 'fs';

import { MakeDocsFiles } from './helpers/make-docs-files';
import { json, NLS, PACKAGE_URI } from './main.interface';
import { ProcessPackage } from './process-package';

MakeDocsFiles();

// make our package.json file
ProcessPackage(json, NLS)
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
