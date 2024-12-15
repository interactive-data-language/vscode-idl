/**
 * Retrieve variable from IDL session
 */
export type GetVarRequest = 'getVar';

/** The name of the variable to return (should be UPPER CASE) */
export type GetVarParams = string;

/**
 * Response when asking for variable
 */
export type GetVarResponse = {
  /** Name of the variable */
  name: string;
  /**
   * IDL type code for variable
   *
   * TODO: map to types to match parsing
   */
  type: number;
  /** String value of the variable */
  value: string;
};
