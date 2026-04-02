export const ADD_DATA_TO_MAP_DESCRIPTION = `
Adds geospatial data to an interactive map displayed in the chat.

Supported layer types:
- **raster** — a georeferenced image file (e.g. GeoTIFF). Provide \`uri\` as the fully-qualified path.
- **vector** — a vector file such as a shapefile or GeoJSON file. Provide \`uri\` as the fully-qualified path.
- **geojson** — inline GeoJSON. Provide the raw GeoJSON string via \`geojson\`.

The tool executes IDL code that opens the dataset, exports it via \`IDLNotebook.Export\`, and returns the structured map data so it can be rendered in the chat.

For raster and vector types the file must already exist on disk and be readable by IDL/ENVI.`;
