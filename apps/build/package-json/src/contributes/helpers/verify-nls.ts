import { IPackageNLS } from '../../package.interface';

/**
 * Makes sure that our NLS file matches our configuration
 */
export function VerifyNLS(key: string, nls: IPackageNLS) {
  // strip out the percent signs
  const useKey = key.substring(1, key.length - 1);

  // return a flag if we are present or not
  return useKey in nls;
}
