/** Node types that are sinks — may only appear as edge targets */
export const SINK_TYPES = new Set(['outputparameters', 'view', 'datamanager']);

/** Node types that are sources — may only appear as edge origins */
export const SOURCE_TYPES = new Set(['inputparameters']);

/**
 * Type to parameter name mapping for datamanager nodes.
 * Maps ENVI data types to their corresponding input parameter names.
 */
export const DATAMANAGER_TYPE_TO_PARAMETER_MAP: { [key: string]: string } = {
  enviraster: 'input_raster',
  envivector: 'input_vector',
  envirasterseries: 'input_raster_series',
  enviannotationset: 'input_annotation_set',
};

/**
 * Type to parameter name mapping for view nodes.
 * Maps ENVI data types and basic types to their corresponding input parameter names.
 * Note: Numeric types are handled separately and map to 'input_number'.
 */
export const VIEW_TYPE_TO_PARAMETER_MAP: { [key: string]: string } = {
  enviraster: 'input_raster',
  envivector: 'input_vector',
  envirasterseries: 'input_raster_series',
  enviannotationset: 'input_annotation_set',
  envipointcloud: 'input_point_cloud',
  string: 'input_string',
};
