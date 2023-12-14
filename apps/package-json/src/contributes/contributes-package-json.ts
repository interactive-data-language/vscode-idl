import { IPackageJSON, IPackageNLS } from '../package.interface';
import { VerifyNLS } from './helpers/verify-nls';

/**
 * Updates the main entries in our package.json file for top-level translations and other things
 */
export function ProcessMainPackageJSON(
  packageJSON: IPackageJSON,
  nls: IPackageNLS
) {
  if (!VerifyNLS(packageJSON['displayName'], nls)) {
    throw new Error(
      `package.json translation for "displayName" is not in NLS file`
    );
  }
  if (!VerifyNLS(packageJSON['description'], nls)) {
    throw new Error(
      `package.json translation for "description" is not in NLS file`
    );
  }
}
