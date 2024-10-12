import { GlobalTokens } from '@idl/types/core';

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
  /** Global tokens that have changed */
  globals: { [key: string]: GlobalTokens };
}

/**
 * Maximum number of change detection jumps
 */
export const CHANGE_DETECTION_MAX_DEPTH = 10;
