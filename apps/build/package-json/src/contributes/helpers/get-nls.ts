import { IPackageNLS } from '../../package.interface';
import { VerifyNLS } from './verify-nls';

/**
 * Makes sure that our NLS file matches our configuration
 */
export function GetNLS(key: string, nls: IPackageNLS) {
  // strip out the percent signs
  const useKey = key.substring(1, key.length - 1);

  if (!VerifyNLS(key, nls)) {
    throw new Error(`Unknown translation key of "${key}"`);
  }

  // return a flag if we are present or not
  return nls[useKey];
}
