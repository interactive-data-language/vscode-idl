# Tools folder

This location contains logic for running our MCP tools within VSCode. These typically go through the debug adapter and run in the integrated instance of IDL directly in VSCOde.

This folder also contains some customized MCP tools that differ slightly from those in the @idl/mcp/idl or @idl/mcp/envi libraries

Mostly because we have direct connections to VSCode, so we can open things in the UI and re-use some of our commands as well.
