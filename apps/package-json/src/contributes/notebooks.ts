import { IDL_NOTEBOOK_EXTENSION, IDL_NOTEBOOK_NAME } from '@idl/shared';

import { IPackageJSON, IPackageNLS } from '../package.interface';
import { VerifyNLS } from './helpers/verify-nls';

/**
 * Adds config for notebooks to our file
 */
export function ProcessNotebooks(packageJSON: IPackageJSON, nls: IPackageNLS) {
  const ourNotebook = {
    type: IDL_NOTEBOOK_NAME,
    displayName: '%notebooks.title%',
    selector: [
      {
        filenamePattern: `*${IDL_NOTEBOOK_EXTENSION}`,
      },
    ],
  };

  if (!VerifyNLS(ourNotebook.displayName, nls)) {
    throw new Error('Notebook displayName not in translation');
  }

  // add to contribution point
  const contrib = packageJSON['contributes'];
  contrib['notebooks'] = [ourNotebook];
}
