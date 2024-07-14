import { IPackageNLS } from '../../package.interface';
import { GetTranslationKey } from './get-translation-key';

/**
 * Map our configuration name to our translation name
 */
export function TranslationFromConfiguration(
  name: string,
  nls: IPackageNLS,
  prefix = 'descriptions'
) {
  const key = `%configuration.${prefix}.${name}%`;

  return GetTranslationKey(key, nls);
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
