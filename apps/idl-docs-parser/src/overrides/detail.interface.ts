import { IDLDataType, IParameterOrPropertyDetails } from '@idl/types/core';

/**
 * Simplified information being overridden for procedures
 */
export interface IStructureOverrideDetail {
  /** Display name for structure */
  display?: string;
  /** Optional overrides for properties */
  properties?: { [key: string]: Partial<IParameterOrPropertyDetails> };
}

/**
 * Simplified information being overridden for procedures
 */
export interface IRoutineOverrideDetail {
  /** Optional overrides for arguments */
  args: { [key: string]: Partial<IParameterOrPropertyDetails> };
  /** Optional overrides for keywords */
  kws: { [key: string]: Partial<IParameterOrPropertyDetails> };
}

/**
 * Simplified information being overridden for functions
 */
export interface IFunctionOverrideDetail extends IRoutineOverrideDetail {
  /** Optionally, the type that is returned */
  returns?: IDLDataType;
}

/**
 * User-specified information for overriding functions
 *
 * Key is the routine name
 */
export interface IFunctionOverride {
  [key: string]: IFunctionOverrideDetail;
}

/**
 * User-specified information for overriding function methods.
 *
 * Key is the routine name
 */
export interface IFunctionMethodOverride {
  [key: string]: IFunctionOverrideDetail;
}

/**
 * User-specified information for overriding procedures.
 *
 * Key is the routine name
 */
export interface IProcedureOverride {
  [key: string]: IRoutineOverrideDetail;
}

/**
 * User-specified information for overriding procedure methods
 *
 * Key is the routine name
 */
export interface IProcedureMethodOverride {
  [key: string]: IRoutineOverrideDetail;
}

/**
 * User-specified information for overriding structures
 *
 * Key is the structure name
 */
export interface IStructureOverride {
  [key: string]: IStructureOverrideDetail;
}
