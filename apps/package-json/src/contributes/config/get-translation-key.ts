import { NLS } from '../../main.interface';
import { IPackageNLS } from '../../package.interface';
import { VerifyNLS } from '../helpers/verify-nls';

/**
 * Get translation key and make sure it exists
 */
export function GetTranslationKey(key: string, nls: IPackageNLS = NLS) {
  // make sure the translation is good
  if (!VerifyNLS(key, nls)) {
    throw new Error(
      `Configuration item "${name}" has no matching translation key of "${key}"`
    );
  }

  return key;
}
