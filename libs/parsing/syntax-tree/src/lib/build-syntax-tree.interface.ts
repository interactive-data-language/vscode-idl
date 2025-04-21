import { GLOBAL_TOKEN_TYPES, GlobalTokenType } from '@idl/types/core';
import { SyntaxProblems } from '@idl/types/problem-codes';
import { PositionArray } from '@idl/types/tokenizer';

/**
 * Start options we pass into the recurser and shared between all recursions
 */
export interface IRecurserOptions {
  /** Flag if we have found a main level program or not */
  foundMain: boolean;
  /** Is it a full parse? */
  full: boolean;
  /** If a token is not closed, this flag will be set so we don't report distracting errors */
  notClosed: boolean;
  /** Depth level of recursion, track for debugging */
  recursionLevel: number;
  /** Start index for processing our array of tokens, used with recursion */
  start: number;
  /** Information regarding the state of our code */
  syntax: SyntaxProblems;
}

/**
 * Options we pass for recursion regarding what we are trying to close
 */
export interface IRecurserCloseOptions {
  /** ID of the token we are trying to close, indicates when we stop */
  closeId: string;
  /** Index of the closing token */
  closeIdx?: number;
}

/**
 * Position of a global token
 */
export interface IGlobalTokenPosition {
  /** The file our token lives in */
  file: string;
  /** Position within the file */
  pos: PositionArray;
}

/**
 * All definitions of a global token
 */
export type GlobalPositions = IGlobalTokenPosition[];

/**
 * Data structure to map global things in IDL and where they come from
 */
export interface IGlobalLocationLookup {
  /**
   * Token-name and position lookup. Store an array of positions because
   * we might have more than one definition to account for.
   *
   * @param {string}[name] The name of our global token
   */
  [name: string]: GlobalPositions;
}

/**
 * Data structure for routines
 */
export interface IRoutineLookup {
  /** Function method definitions */
  func: IGlobalLocationLookup;
  /** Procedure method definitions */
  pro: IGlobalLocationLookup;
}

/**
 * Data structure for an object class which contains the source,
 * procedures, and functions.
 */
export interface IObjectInfo extends IRoutineLookup {
  /** Where is an object class defined */
  source: GlobalPositions;
}

/**
 * Data structure for object classes
 */
export interface IClassLookup {
  /**
   * Information about object classes organized by class name.
   *
   * @param {string}[routine] The name of our global token
   */
  [name: string]: IObjectInfo;
}

/**
 * Data structure to store and track the global tokens that we use
 * within our routine.
 *
 * This allows us to do additional checking after everything is initially
 * parsed as part of a static analysis.
 */
export type UsesTheseGlobalTokens = {
  [property in GlobalTokenType]: { [key: string]: any };
};

/**
 * Default value for global tokens
 */
export const DEFAULT_USES_THESE_GLOBAL_TOKEN = {} as UsesTheseGlobalTokens;
const global_names = Object.values(GLOBAL_TOKEN_TYPES);
for (let i = 0; i < global_names.length; i++) {
  DEFAULT_USES_THESE_GLOBAL_TOKEN[global_names[i]] = {};
}
