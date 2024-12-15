import { IIDLPreference } from './idl-machine.set-prefs.interface';

/**
 * Get IDL preferences
 */
export type GetPrefsRequest = 'getPrefs';

/** Parameters to get preferences */
export type GetPrefsParams = void;

/**
 * Response for preferences
 */
export type GetPrefsResponse = IIDLPreference[];
