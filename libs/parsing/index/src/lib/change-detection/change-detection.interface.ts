/**
 * rResponse from change detection
 */
export interface IChangeDetection {
  /** The files that changed */
  changed: string[];
  /**
   * If we have a problem during change detection, and it is because the file doesn't exist, then
   * report it.
   */
  missing: string[];
}
