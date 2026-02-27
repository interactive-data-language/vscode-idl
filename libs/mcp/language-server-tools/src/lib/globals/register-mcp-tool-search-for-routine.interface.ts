import { GlobalTokenType } from '@idl/types/idl-data-types';
import { MCP_TOOL_LOOKUP } from '@idl/types/mcp';

export const SEARCH_FOR_ROUTINE_DESCRIPTION = `
Used to search for known IDL routines that you can use to retrieve documentation/more information about. 

You can search for one or more of functions, procedures, function methods, procedure methods, structures, and system variables.

To retrieve more detailed information (i.e. docs), use the returned names with the "${MCP_TOOL_LOOKUP.GET_ROUTINE_DOCS}" tool.

Examples:

- Searching for function with plot in the name:
  {"routines":[{"name":"plot", "type":"Function"}]}

- Searching for the ENVI Task "ISODataClassification":
  {"routines":[{"name":"ISODataClassification", "type":"Function"}]}

- Searching for all methods for the ENVIRaster class
  {"routines":[{"name":"enviraster::", "type":"FunctionMethod"}, {"name":"enviraster::", "routineType":"ProcedureMethod"}]}

- Searching for information about the HTTPRequest class (i.e. properties):
  {"routines":[{"name":"httprequest", "type":"StructureOrClassDefinition"},{"name":"httprequest::", "type":"FunctionMethod"}, {"name":"httprequest::", "routineType":"ProcedureMethod"}]}
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
