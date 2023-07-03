import { EN } from './languages/en/en';
import { ITranslation } from './translation.interface';

/**
 * Simple wrapper for our IDL extension languages. Index signature and
 * contains all available languages "hard coded" for autocomplete.
 */
interface ILanguageLookup {
  /** Indexing definition */
  [key: string]: ITranslation;
  /** English translation */
  en: ITranslation;
}

/**
 * Lookup for all of our languages supported by the module
 */
export const LANGUAGES: ILanguageLookup = {
  en: EN,
};
