/** Node types that are sinks — may only appear as edge targets */
export const SINK_TYPES = new Set(['outputparameters', 'view', 'datamanager']);

/** Node types that are sources — may only appear as edge origins */
export const SOURCE_TYPES = new Set(['inputparameters']);
