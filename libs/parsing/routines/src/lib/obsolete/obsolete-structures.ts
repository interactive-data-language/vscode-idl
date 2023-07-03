import { IObsolete } from './obsolete.interface';

/**
 * Obsolete structures
 */
export const OBSOLETE_STRUCTURES: IObsolete = {};

/**
 * Obsolete structures properties for structures
 *
 * Key should be "class.property" all lower case
 */
export const OBSOLETE_PROPERTIES: IObsolete = {
  'fstat.rec_len': 'This field is obsolete and will always contain zero',
};
