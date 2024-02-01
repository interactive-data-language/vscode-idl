import { IDL_STRING_TYPE, IParameterOrPropertyDetails } from '@idl/types/core';

/**
 * Keywords for the thread pool
 */
export const ENVI_ERROR_KEYWORD: IParameterOrPropertyDetails = {
  direction: 'out',
  type: IDL_STRING_TYPE,
  display: 'error',
  private: false,
  code: true,
  source: 'internal',
  docs: `Set this keyword to a named variable that will contain any error message issued during execution of this routine. If no error occurs, the ERROR variable will be set to a null string (''). If an error occurs and the routine is a function, then the function result will be undefined.\n\nWhen this keyword is not set and an error occurs, ENVI returns to the caller and execution halts. In this case, the error message is contained within !ERROR_STATE and can be caught using IDL's CATCH routine. See IDL Help for more information on !ERROR_STATE and CATCH.`,
  pos: [0, 0, 0],
};
