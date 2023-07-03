import { IObsolete } from './obsolete.interface';

/**
 * Obsolete function methods
 */
export const OBSOLETE_FUNCTION_METHODS: IObsolete = {
  'envi::createraster': 'Use the ENVIRaster function instead',
  'envi::createrastermetadata': 'Use ENVIRasterMetadata instead',
  'envi::getopendata':
    'Use the "data" property of ENVI in order to get the open data',
  'envi::getpreference': 'Use the "preferences" property of ENVI instead',
  'envinitf::getdesuserdefinedsubheaderfields': undefined,
  'envinitf::getdesuserdefinedsubheadervalue': undefined,
  'envitaskparameter::queryproperty':
    'Use the associated method on the specific ENVI parameter classes instead',
  'envitaskparameter::validate':
    'Use the associated method on the specific ENVI parameter classes instead',
};

/**
 * Obsolete function method keywords
 *
 * Key should be "routine.keyword" all lower case
 */
export const OBSOLETE_FUNCTION_METHOD_KEYWORDS: IObsolete = {};
