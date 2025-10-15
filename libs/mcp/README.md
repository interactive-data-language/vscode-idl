# MCP

This folder is meant to contain shared code for MCP tooling and servers.

However, to avoid circular imports and follow other patterns, the logic for the MCP tools exist in the locations that they run.

They can be found in:

- IDL/ENVI execution:
  libs\vscode\debug\src\lib\mcp
- Lanuage server tool registration and communication handling:
  libs\vscode\server\src\lib\mcp
