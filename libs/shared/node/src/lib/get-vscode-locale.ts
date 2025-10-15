/**
 * Checks the VSCode locale from the environment variables
 *
 * Defaults to english if error in checking environment variables
 */
export function GetVSCodeLocale() {
  /** Locale */
  let locale = 'en';

  /**
   * Check for environment variable
   */
  if ('VSCODE_NLS_CONFIG' in process.env) {
    try {
      // parse the JSOn to get the language information
      const language: { locale: string } = JSON.parse(
        process.env.VSCODE_NLS_CONFIG
      );

      // check if we have our language and update our constant
      locale = language.locale;
    } catch (err) {
      // log to console and do nothing
      console.error(err);
    }
  }

  return locale;
}
