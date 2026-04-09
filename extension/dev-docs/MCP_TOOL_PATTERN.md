## MCP Tool Pattern

Pattern for how MCP tools are organized

### Naming Convention:

- mcp-tool\*.interface.ts for type definitions for each MCP Tool which creates a literal type, defines the input parameters, and optional output parameters

- register-mcp-tool\*.ts for adding the MCP tool to the HTTP server

- run-mcp-tool\*.ts for invoking ENVI + IDL for MCP tool execution

- mcp-test-\*.ts for the integration tests for MCP tools

### Naming Detail

MCP naming paradigm detail:

- MCP types in the folder "libs\types\mcp\src\lib"
  - Each MCP tool has it’s own type file "mcp-tool\*.interface.ts"

  - Split by HTTP or VSCode
    - VSCode indicates that the tool will invoke ENVI and IDL

    - HTTP means its an MCP tool that is only available via HTTP

- MCP tool registration in "libs\mcp\server-tools" and "libs\mcp\language-server"
  - Each MCP tool that is registered for the HTTP server follows naming "register-mcp-tool\*.ts"

- Running MCP tools in ENVI and IDL live in "libs\vscode\mcp"
  - File names map to "run-mcp-tool\*.ts"

- Tests for MCP tools are in the integration test suite (client-e2e). They can be found here "apps\client-e2e\src\tests\mcp"
  - There’s an MCP folder that follows the naming convention of "mcp-test\*.ts" with the tool name inserted in the test itself
