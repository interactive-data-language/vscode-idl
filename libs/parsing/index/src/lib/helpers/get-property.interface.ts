import {
  GlobalTokenType,
  IBaseIndexedToken,
  IDLDataType,
  IParameterOrPropertyDetails,
} from '@idl/data-types/core';

/**
 * Information returned when we found a property, so we can have some context for
 * where it came from
 */
export interface IFoundParameter
  extends IBaseIndexedToken,
    IParameterOrPropertyDetails {
  /** Type of global token */
  globalType: GlobalTokenType;
  /** Name of the global token */
  globalName: string;
}

/**
 * Information returned when we found a property, so we can have some context for
 * where it came from
 */
export interface IFoundProperty extends IFoundParameter {
  /** Type for the class that our property belongs to */
  class: IDLDataType;
}
