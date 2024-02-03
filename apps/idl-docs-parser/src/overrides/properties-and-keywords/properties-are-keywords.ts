import { GLOBAL_TOKEN_TYPES } from '@idl/types/core';

import { UpdateThese } from '../../helpers/set-keywords-as-properties.interface';

/**
 * Define which functions, procedures, or methods need to have additional keywords added
 * that match the properties of an object class.
 *
 * The key is our object name and the values are the other global tokens that are routines
 * that we need to update.
 *
 * Any object class that we encounter that starts with "IDLgr" has this applied automatically
 * in `set-keywords-as-properties`
 *
 * Additionally, if another token has a conflicting keyword defined, it wins over the property
 */
export const PROPERTIES_ARE_KEYWORDS: {
  [key: string]: UpdateThese;
} = {};
PROPERTIES_ARE_KEYWORDS['idl_idlbridge'] = [
  ['idl_idlbridge', GLOBAL_TOKEN_TYPES.FUNCTION],
  ['idl_idlbridge::init', GLOBAL_TOKEN_TYPES.FUNCTION],
  ['idl_idlbridge::getproperty', GLOBAL_TOKEN_TYPES.PROCEDURE_METHOD],
  ['idl_idlbridge::setproperty', GLOBAL_TOKEN_TYPES.PROCEDURE_METHOD],
];
PROPERTIES_ARE_KEYWORDS['idlneturl'] = [
  ['idlneturl', GLOBAL_TOKEN_TYPES.FUNCTION],
  ['idlneturl::init', GLOBAL_TOKEN_TYPES.FUNCTION],
  ['idlneturl::getproperty', GLOBAL_TOKEN_TYPES.PROCEDURE_METHOD],
  ['idlneturl::setproperty', GLOBAL_TOKEN_TYPES.PROCEDURE_METHOD],
];
PROPERTIES_ARE_KEYWORDS['idlsysmonitorinfo'] = [
  ['idlsysmonitorinfo', GLOBAL_TOKEN_TYPES.FUNCTION],
  ['idlsysmonitorinfo::init', GLOBAL_TOKEN_TYPES.FUNCTION],
  ['idlsysmonitorinfo::getproperty', GLOBAL_TOKEN_TYPES.PROCEDURE_METHOD],
  ['idlsysmonitorinfo::setproperty', GLOBAL_TOKEN_TYPES.PROCEDURE_METHOD],
];
PROPERTIES_ARE_KEYWORDS['enviroi'] = [['enviroi', GLOBAL_TOKEN_TYPES.FUNCTION]];
