When adding new parameters, make sure you make changes in the appropriate locations:

1. Add new function following existing naming convention

2. Add alias for the type written in task files to this location:

libs\types\idl-data-types\src\lib\custom-type-display-names.interface.ts

3. Add the type _alphabetically_ to the routine that converts types to MCP parameters:

libs\mcp\idl-to-mcp\src\lib\idl-parameter-to-mcp-parameter.ts
