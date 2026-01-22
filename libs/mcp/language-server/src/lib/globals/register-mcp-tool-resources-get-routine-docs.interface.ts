import { MCP_TOOL_LOOKUP } from '@idl/types/mcp';

export const NO_MATCHES = `No matches`;

export const GET_ROUTINE_DOCS_DESCRIPTION = `
Returns detailed information about one or more IDL routines.

Returns the first match found or the text "${NO_MATCHES}" if we can't find a routine.

To discover routines, you can use the ${MCP_TOOL_LOOKUP.RESOURCES_SEARCH_FOR_ROUTINE} before this one..

Examples:

- Return docs for the plot function:
  {"routines":[{"name":"plot", "type":"Function"}]}

- Return docs about the HTTPRequest class (i.e. properties):
  {"routines":[{"name":"httprequest", "type":"StructureOrClassDefinition"}]}
`;
