import { LANGUAGES } from './languages';

/**
 * Constant that contains the translation information for our
 * extension.
 */
export let IDL_TRANSLATION = LANGUAGES.en;

/**
 * Checks the environment variable VSCODE_NLS_CONFIG for the
 * language that VSCode has been started using.
 *
 * With this environment variable, we update ur constant IDL_TRANSLATION
 * with the right language.
 *
 * This works in the language client and language server.
 */
export function InitializeTranslation(locale: string) {
  /**
   * Normalize string
   */
  const useLocale = locale.toLowerCase().trim();

  // check if we have our language and update our constant
  if (useLocale in LANGUAGES) {
    IDL_TRANSLATION = LANGUAGES[useLocale];
  }
}
