// `@mapbox/geojson-extent` (used transitively by the AOI map) references
// Node's `global`, which the browser doesn't define.
(globalThis as unknown as { global: typeof globalThis }).global = globalThis;
