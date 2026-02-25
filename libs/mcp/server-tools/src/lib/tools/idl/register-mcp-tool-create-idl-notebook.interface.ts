import { MCP_TOOL_LOOKUP } from '@idl/types/mcp';

export const CREATE_IDL_NOTEBOOK_DESCRIPTION = `
Creates an IDL Notebook and should always be used when asked to create notebooks for IDL code.

This is a native IDL Notebook and does not use or require Jupyter or require other configuration in order to work. 

RULES:

- Code cells MUST not have "compile_opt idl2" added, this is done behind the scenes.

- Functions or procedures in code cell MUST have "compile_opt idl2" added

- When creating notebooks for ENVI, find available ENVINotebook methods (dedicated geospatial data display) with the tool "${MCP_TOOL_LOOKUP.SEARCH_FOR_ROUTINE}"
`;
