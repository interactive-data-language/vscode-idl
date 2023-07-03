import { IObsolete } from './obsolete.interface';

/**
 * Obsolete functions
 */
export const OBSOLETE_FUNCTIONS: IObsolete = {
  e3de: undefined,
  envilasheader: undefined,
  e3dlidar: undefined,
  e3dlidarpointfilter: 'See the ENVIPointCloudFeatureExtractionTask',
  e3dlidarspatialref: undefined,
  e3dproductionparameters: 'See the ENVIPointCloudFeatureExtractionTask',
  e3dproductsinfo: undefined,
  envirasterspatialrefstandard: 'Use ENVIStandardRasterSpatialRef instead',
  envirasterspatialrefrpc: 'Use ENVIRPCRasterSpatialRef instead',
  envirasterspatialrefpseudo: 'Use ENVIRasterSpatialRefPseudo instead',
  envisetrastermetadatatask:
    'Use the metadata property of ENVIRasters which has all the API you should need. This is a unique task designed for use in the ENVI Modeler, not the ENVI API.',
  envieditrastermetadatatask:
    'Use the metadata property of ENVIRasters which has all the API you should need. This is a unique task designed for use in the ENVI Modeler, not the ENVI API.',
  envitaskparameter: 'Use the specific ENVI parameter classes instead',
  idlfflanguagecat: undefined,
  idlgrmpeg: undefined,
};

/**
 * Obsolete function keywords
 *
 * Key should be "routine.keyword" all lower case
 */
export const OBSOLETE_FUNCTION_KEYWORDS: IObsolete = {
  'ptrarr.nozero': undefined,
};
