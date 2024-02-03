// global tokens
// dont use token names because they dont properly overlap with what we need to

import { PositionArray } from '@idl/parsing/tokenizer-types';

import { IDLDataType } from '../idl-data-types.interface';

// verbosely store
export type GlobalFunctionToken = 'f';
export type GlobalProcedureToken = 'p';
export type GlobalFunctionMethodToken = 'fm';
export type GlobalProcedureMethodToken = 'pm';
export type GlobalStructureToken = 's';
export type GlobalSystemVariableToken = 'sv';
export type GlobalCommonToken = 'c';

/**
 * Global tokens for routines that we call
 */
export type GlobalRoutineType =
  | GlobalFunctionToken
  | GlobalProcedureToken
  | GlobalFunctionMethodToken
  | GlobalProcedureMethodToken;

/**
 * Allowed global types of tokens that we track
 */
export type GlobalTokenType =
  | GlobalRoutineType
  | GlobalStructureToken
  | GlobalSystemVariableToken
  | GlobalCommonToken;

/**
 * Strictly types data structure for global token lookup
 */
interface IGlobalTokenTypeLookup {
  FUNCTION: GlobalFunctionToken;
  PROCEDURE: GlobalProcedureToken;
  FUNCTION_METHOD: GlobalFunctionMethodToken;
  PROCEDURE_METHOD: GlobalProcedureMethodToken;
  STRUCTURE: GlobalStructureToken;
  SYSTEM_VARIABLE: GlobalSystemVariableToken;
  COMMON: GlobalCommonToken;
}

/**
 * Names for all global tokens
 */
export const GLOBAL_TOKEN_TYPES: IGlobalTokenTypeLookup = {
  FUNCTION: 'f',
  PROCEDURE: 'p',
  FUNCTION_METHOD: 'fm',
  PROCEDURE_METHOD: 'pm',
  STRUCTURE: 's',
  SYSTEM_VARIABLE: 'sv',
  COMMON: 'c',
};

/** Native code */
type InternalTokenSource = 'internal';
/** IDL lib folder */
type IDLTokenSource = 'idl';
/** ENVI code */
type ENVITokenSource = 'envi';
/** ENVI Dl module */
type ENVIDLTokenSource = 'envi-dl';
/** ENVI ML code, part of ENVI DL */
type ENVIMLTokenSource = 'envi-ml';
/** User code */
type UserTokenSource = 'user';

/**
 * Source for global tokens
 */
export type GlobalTokenSource =
  | InternalTokenSource
  | IDLTokenSource
  | ENVITokenSource
  | ENVIDLTokenSource
  | ENVIMLTokenSource
  | UserTokenSource;

interface IGlobalTokenSourceLookup {
  /** Native (i.e. C, C++, or something we don't have PRO code for) */
  INTERNAL: InternalTokenSource;
  IDL: IDLTokenSource;
  ENVI: ENVITokenSource;
  ENVI_DL: ENVIDLTokenSource;
  /** ENVI machine learning */
  ENVI_ML: ENVIMLTokenSource;
  /** A user's code */
  USER: UserTokenSource;
}

/**
 * Sources for code
 */
export const GLOBAL_TOKEN_SOURCE_LOOKUP: IGlobalTokenSourceLookup = {
  INTERNAL: 'internal',
  IDL: 'idl',
  ENVI: 'envi',
  ENVI_DL: 'envi-dl',
  ENVI_ML: 'envi-ml',
  USER: 'user',
};

/**
 * Base information stored for any global or local token
 */
export interface IBaseTokenMetadata {
  /** The name that we display to the user */
  display: string;
  /** Joined string for our tokens documentation */
  docs: string;
  /** Source information for a routine */
  source: GlobalTokenSource;
  /** Is it private? */
  private?: boolean;
}

/**
 * Base information that we store for a token that has a value (i.e. property or variable)
 */
export interface IBaseValueDetails extends IBaseTokenMetadata {
  /** What is the data type? */
  type: IDLDataType;
}

/**
 * Direction that a parameter goes in
 */
export type ParameterDirection = 'in' | 'out' | 'bidirectional';

/**
 * Information about keywords or arguments.
 */
export interface IParameterOrPropertyDetails extends IBaseValueDetails {
  /** Is it input, output, or bidirectional? */
  direction: ParameterDirection;
  /** Is it required or optional? */
  req?: boolean;
  /** Sets a flag that tells us the parameter comes from code */
  code: boolean;
  /** If from code, the position of our token */
  pos: PositionArray;
}

/**
 * Metadata for system variables
 */
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ISystemVariableMetadata extends IBaseValueDetails {}

/**
 * Information that we save for parameters (arguments or keywords).
 *
 * Key is lower-case name
 */
export interface IParameterLookup {
  [key: string]: IParameterOrPropertyDetails;
}

/**
 * Metadata for routines
 */
export interface IRoutineMetadata extends IBaseTokenMetadata {
  /** Source information for a routine */
  source: GlobalTokenSource;
  /** Arguments by name - should preserve order */
  args: IParameterLookup;
  /** Keywords by name - should preserve order */
  kws: IParameterLookup;
  /**
   * Documentation fields for our routine, it contains the content not captured
   * by keywords or arguments such as header, Author, Date, revisions, etc.
   */
  docsLookup: { [key: string]: string };
  /**
   * Names of structures that are defined in our routine
   */
  struct: IGlobalIndexedToken<GlobalStructureToken>[];
}

/**
 * Metadata for functions
 */
export interface IFunctionMetadata extends IRoutineMetadata {
  /** The data type that we return from our function */
  returns: IDLDataType;
}

/**
 * Metadata for routine methods methods
 */
export interface IMethodMetadata extends IRoutineMetadata {
  /** Track the class name for convenience (so we don't need to process the name to get) */
  className: string;
  /** Track the class name for convenience (so we don't need to process the name to get) */
  method: string;
}

/**
 * Metadata for function and procedure methods
 */
export interface IFunctionMethodMetadata
  extends IMethodMetadata,
    IFunctionMetadata {}

/**
 * Information that we save for properties
 */
export interface IPropertyLookup {
  [key: string]: IParameterOrPropertyDetails;
}

/**
 * Metadata for structures/classes and their properties
 */
export interface IStructureMetadata extends IBaseTokenMetadata {
  /** Source information for a routine */
  source: GlobalTokenSource;
  /** An array of lower-case class names that we inherit */
  inherits: string[];
  /** Properties by name - should preserve order */
  props: IPropertyLookup;
  /** Documentation fields, cleared after use */
  docsLookup?: { [key: string]: string };
}

/**
 * Metadata lookup for our types of global tokens
 */
export type GlobalTokenMetadata<T extends GlobalTokenType> =
  T extends GlobalFunctionToken
    ? IFunctionMetadata
    : T extends GlobalProcedureToken
    ? IRoutineMetadata
    : T extends GlobalFunctionMethodToken
    ? IFunctionMethodMetadata
    : T extends GlobalProcedureMethodToken
    ? IMethodMetadata
    : T extends GlobalStructureToken
    ? IStructureMetadata
    : T extends GlobalSystemVariableToken
    ? ISystemVariableMetadata
    : IBaseTokenMetadata;

/**
 * Base data structure for global or local indexed tokens
 */
export interface IBaseIndexedToken {
  /**
   * Lower-case name of the tracked token (i.e. function name).
   *
   * Display name can be found as a property on the metadata
   */
  name: string;
  /** Position of definition */
  pos: PositionArray;
  /**
   * File that our token is found in.
   *
   * Used to indicate that the token we have does not originate in the same file
   * that we processed.
   *
   * Used for edge cases with "@include" statements
   */
  file?: string;
  /**
   * If our token lives in a separate file, where is it located in that file
   *
   * Used to indicate that the token we have does not originate in the same file
   * that we processed.
   *
   * Used for edge cases with "@include" statements
   */
  filePos?: PositionArray;
}

/**
 * Global token that we are storing (things available everywhere)
 */
export interface IGlobalIndexedToken<T extends GlobalTokenType>
  extends IBaseIndexedToken {
  /** Type of the token we are tracking */
  type: T;
  /** Metadata for our global token. Typed to match the "type" property */
  meta: GlobalTokenMetadata<T>;
}

/**
 * Union of all global routine token types
 */
export type GlobalRoutineTokenType =
  | GlobalFunctionToken
  | GlobalFunctionMethodToken
  | GlobalProcedureToken
  | GlobalProcedureMethodToken;

/**
 * Union type for all global tokens for routines
 */
export type GlobalRoutineToken = IGlobalIndexedToken<
  | GlobalFunctionToken
  | GlobalFunctionMethodToken
  | GlobalProcedureToken
  | GlobalProcedureMethodToken
>;

/**
 * Global tokens that we extract from a file (things available everywhere)
 */
export type GlobalTokens = IGlobalIndexedToken<GlobalTokenType>[];

/**
 * Compile options by routine
 */
export interface ICompileOptions {
  /**
   * Compile options for procedures by name in a single file
   */
  pro: { [key: string]: string[] };
  /**
   * Compile options for functions by name in a single file
   */
  func: { [key: string]: string[] };
  /**
   * Compile options at main level
   */
  main: string[];
}

/**
 * Union type for global routine tokens
 */
export type GlobalIndexedRoutineToken = IGlobalIndexedToken<GlobalRoutineType>;
