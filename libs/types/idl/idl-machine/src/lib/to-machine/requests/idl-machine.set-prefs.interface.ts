/**
 * Set IDL preference
 */
export type SetPrefsRequest = 'setPrefs';

/**
 * Individual preference to set
 */
export interface IIDLPreference {
  /** Name of the preference */
  name: string;
  /** Value of the preference */
  value: string;
}

/** Parameters to set preferences */
export type SetPrefsParams = IIDLPreference[];

/**
 * Number of preferences set
 */
export type SetPrefsResponse = number;
