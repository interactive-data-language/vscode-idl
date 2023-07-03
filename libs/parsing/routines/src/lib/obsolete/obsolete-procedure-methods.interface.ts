import { IObsolete } from './obsolete.interface';

/**
 * Obsolete procedure methods
 */
export const OBSOLETE_PROCEDURE_METHODS: IObsolete = {
  'envi::exportraster': 'Use the "export" method for the raster object instead',
};

/**
 * Obsolete procedure method keywords
 *
 * Key should be "routine.keyword" all lower case
 */
export const OBSOLETE_PROCEDURE_METHOD_KEYWORDS: IObsolete = {};
