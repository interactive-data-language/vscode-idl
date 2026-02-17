import { GlobalTokenType } from '@idl/types/idl-data-types';
import { MCP_TOOL_LOOKUP } from '@idl/types/mcp';

export const SEARCH_FOR_ROUTINE_DESCRIPTION = `
Returns names of routines that match your search parameters. 

Uses fuzzy searching and you can search for one or all of functions, procedures, function methods, procedure methods, structures, and system variables.

To retrieve more detailed information, use the returned names with the ${MCP_TOOL_LOOKUP.GET_ROUTINE_DOCS} tool.

Default search looks across all types, or you can select a specific type of routine.

Examples:

- Searching for function with plot in the name:
  {"routines":[{"name":"plot", "type":"Function"}]}

- Searching for all methods for the ENVIRaster class
  {"routines":[{"name":"enviraster::", "type":"FunctionMethod"}, {"name":"enviraster::", "routineType":"ProcedureMethod"}]}

- Searching for information about the HTTPRequest class (i.e. properties):
  {"routines":[{"name":"httprequest", "type":"StructureOrClassDefinition"}]}
`;

/**
 * Map values to strings
 */
export type ValsOfToStrings<T extends string> = {
  [P in T]: string;
};

export const mappedNames: ValsOfToStrings<GlobalTokenType> = {
  c: 'CommonBlock',
  f: 'Function',
  fm: 'FunctionMethod',
  p: 'Procedure',
  pm: 'ProcedureMethod',
  s: 'StructureOrClassDefinition',
  sv: 'SystemVariable',
};

export const reverseMap: { [key: string]: GlobalTokenType } = {
  CommonBlock: 'c',
  Function: 'f',
  FunctionMethod: 'fm',
  Procedure: 'p',
  ProcedureMethod: 'pm',
  StructureOrClassDefinition: 's',
  SystemVariable: 'sv',
};
