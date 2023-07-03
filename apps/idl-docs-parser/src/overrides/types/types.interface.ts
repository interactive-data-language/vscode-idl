import { ParameterDirection } from '@idl/data-types/core';

/**
 * Simplified information being overridden for procedures
 */
export interface IStructureOverrideTypes {
  /** Optional overrides for properties */
  properties: { [key: string]: IParameterOverride };
}

export interface IParameterOverride {
  /** Direction of said data type */
  direction?: ParameterDirection;
  /** Data type */
  type: string;
}

/**
 * Simplified information being overridden for procedures
 */
export interface IRoutineOverrideTypes {
  /** Optional overrides for arguments */
  args: { [key: string]: IParameterOverride };
  /** Optional overrides for keywords */
  kws: { [key: string]: IParameterOverride };
}

/**
 * Simplified information being overridden for functions
 */
export interface IFunctionOverrideTypes extends IRoutineOverrideTypes {
  /** Optionally, the type that is returned */
  returns: string;
}

/**
 * User-specified information for overriding functions
 *
 * Key is the routine name
 */
export interface IFunctionTypeOverride {
  [key: string]: IFunctionOverrideTypes;
}

/**
 * User-specified information for overriding function methods.
 *
 * Key is the routine name
 */
export interface IFunctionMethodTypeOverride {
  [key: string]: IFunctionOverrideTypes;
}

/**
 * User-specified information for overriding procedures.
 *
 * Key is the routine name
 */
export interface IProcedureTypeOverride {
  [key: string]: IRoutineOverrideTypes;
}

/**
 * User-specified information for overriding procedure methods
 *
 * Key is the routine name
 */
export interface IProcedureMethodTypeOverride {
  [key: string]: IRoutineOverrideTypes;
}

/**
 * User-specified information for overriding structures
 *
 * Key is the structure name
 */
export interface IStructureTypeOverride {
  [key: string]: IStructureOverrideTypes;
}
