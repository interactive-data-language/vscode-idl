/**
 * Data structure for obsolete routines
 */
export interface IObsolete {
  /**
   * If there is an alternative, the value stored should be presented to the user
   */
  [key: string]: string | undefined;
}
