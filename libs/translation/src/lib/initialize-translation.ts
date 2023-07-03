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
export function InitializeTranslation() {
  //   TODO: is there an
  // check if our environment variable is present
  if ('VSCODE_NLS_CONFIG' in process.env) {
    try {
      // parse the JSOn to get the language information
      const language: { locale: string } = JSON.parse(
        process.env.VSCODE_NLS_CONFIG
      );

      // check if we have our language and update our constant
      if (language.locale in LANGUAGES) {
        IDL_TRANSLATION = LANGUAGES[language.locale];
      }
    } catch (err) {
      // log to console and do nothing
      console.error(err);
    }
  }
}
