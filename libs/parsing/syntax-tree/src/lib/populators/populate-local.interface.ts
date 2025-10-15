import {
  IBaseIndexedToken,
  IBaseTokenMetadata,
  IBaseValueDetails,
} from '@idl/types/core';
import { PositionArray } from '@idl/types/tokenizer';

// locally tracked tokens
export type LocalVariableToken = 'v';

/**
 * Allowed global types of tokens that we track
 */
export type LocalTokenTypes = LocalVariableToken;

/**
 * Strictly types data structure for global token lookup
 */
interface ILocalTokenNameLookup {
  VARIABLE: LocalVariableToken;
}

/**
 * Names for all global tokens
 */
export const LOCAL_TOKEN_LOOKUP: ILocalTokenNameLookup = {
  VARIABLE: 'v',
};

/**
 * Metadata for variable tokens
 */
export interface ILocalVariableTokenMetadata extends IBaseValueDetails {
  /**
   * For variables that we detect, can we reset them during our post-processing?
   *
   * This is needed because we have variables from arguments and keywords which can't reset as
   * they are static, but we have variables inside code from things like `a = plot()` where, if
   * the function "plot()" changes, we have to reset the variable and re-determine the type for
   * said variable.
   *
   * We don't do this for args/keywords though because they are static.
   */
  canReset: boolean;
  /** A flag indicating if our variable has been defined or not */
  isDefined: boolean;
  /** Flag indicating if our variable represents a static class or not */
  isStaticClass?: boolean;
  /**
   * The locations where we use this variable
   *
   * If the line number is -1, we have a variable defined in another
   * notebook cell
   */
  usage: PositionArray[];
}

/**
 * Metadata lookup for our types of local tokens
 */
export type LocalTokenMetadata<T extends LocalTokenTypes> =
  T extends LocalVariableToken
    ? ILocalVariableTokenMetadata
    : IBaseTokenMetadata;

/**
 * Local token that we are storing, only available within a specific routine or
 * main level program
 */
export interface ILocalIndexedToken<T extends LocalTokenTypes>
  extends IBaseIndexedToken {
  /** Metadata for our local token. Typed to match the "type" property */
  meta: LocalTokenMetadata<T>;
  /** Type of local token we are tracking (NOT DATA TYPE, SEE meta.type) */
  type: T;
}

/** Single local token (i.e. variable in IDL code) */
export type LocalToken = ILocalIndexedToken<LocalTokenTypes>;

/**
 * Lookup for tokens defined locally within a routine or main level program
 */
export interface ILocalTokenLookup {
  /** Key should be lower-case variable name */
  [key: string]: LocalToken;
}

/**
 * Local tokens that we have extracted from a file
 */
export interface ILocalTokens {
  /**
   * Local tokens for functions by name in a single file
   */
  func: { [key: string]: ILocalTokenLookup };
  /**
   * Local tokens defined in main level programs
   */
  main: ILocalTokenLookup;
  /**
   * Local tokens for procedures by name in a single file
   */
  pro: { [key: string]: ILocalTokenLookup };
}

/**
 * Default tokens for local
 */
export const DEFAULT_LOCAL_TOKENS: ILocalTokens = {
  pro: {},
  func: {},
  main: {},
};
