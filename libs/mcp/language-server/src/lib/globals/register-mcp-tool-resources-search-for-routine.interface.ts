export const SEARCH_FOR_ROUTINE_DESCRIPTION = `
Searches our language server for matching routines in IDL. Only returns routines that include the search term in their name. 

You can search for one or all of functions, procedures, function methods, procedure methods, structures, and system variables.

Default search looks across all types, or you can select a specific type of routine.

Examples:

- Searching for the plot function:
  {"queries":[{"name":"plot", "routineType":"Function"}]}

- Searching for all methods for the ENVIRaster class
  {"queries":[{"name":"enviraster::", "routineType":"FunctionMethod"}, {"name":"enviraster::", "routineType":"ProcedureMethod"}]}

- Searching for information about the HTTPRequest class (i.e. properties):
  {"queries":[{"name":"httprequest", "routineType":"StructureOrClassDefinition"}]}
`;
