import { IPackageNLS } from '../../package.interface';
import { VerifyNLS } from '../helpers/verify-nls';

/**
 * Map our configuration name to our translation name
 */
export function TranslationFromConfiguration(
  name: string,
  nls: IPackageNLS,
  prefix = 'descriptions'
) {
  const key = `%configuration.${prefix}.${name}%`;

  // make sure the translation is good
  if (!VerifyNLS(key, nls)) {
    throw new Error(
      `Configuration item "${name}" has no matching translation key of "${key}"`
    );
  }

  return key;
}

/**
 * Map our configuration name to our translation name
 */
export function TranslationFromConfigurationChoices(
  choices: string[],
  nls: IPackageNLS,
  prefix: string
) {
  return choices.map((choice) =>
    TranslationFromConfiguration(choice, nls, prefix)
  );
}
