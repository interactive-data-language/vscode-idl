import {
  IBaseIndexedToken,
  IBaseTokenMetadata,
  IBaseValueDetails,
} from '@idl/data-types/core';
import { PositionArray } from '@idl/parsing/tokenizer-types';

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
  /** Type of local token we are tracking (NOT DATA TYPE, SEE meta.type) */
  type: T;
  /** Metadata for our local token. Typed to match the "type" property */
  meta: LocalTokenMetadata<T>;
}

/**
 * Local tokens that we extract from a routine or main level program
 */
export type LocalTokens = ILocalIndexedToken<LocalTokenTypes>[];

/**
 * Lookup for tokens defined locally within a routine or main level program
 */
export interface ILocalTokenLookup {
  /** Key should be lower-case variable name */
  [key: string]: ILocalIndexedToken<LocalTokenTypes>;
}

/**
 * Local tokens that we have extracted from a file
 */
export interface ILocalTokens {
  /**
   * Local tokens for procedures by name in a single file
   */
  pro: { [key: string]: ILocalTokenLookup };
  /**
   * Local tokens for functions by name in a single file
   */
  func: { [key: string]: ILocalTokenLookup };
  /**
   * Local tokens defined in main level programs
   */
  main: ILocalTokenLookup;
}
