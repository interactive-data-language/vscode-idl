const { existsSync, readdirSync } = require('fs');
const { join } = require('path');

// get the MCP folder path
const mcpDir = join(process.cwd(), 'idl', 'vscode', 'mcp');

// check if the directory exists
if (!existsSync(mcpDir)) {
  console.error(`ERROR: MCP directory does not exist: ${mcpDir}`);
  process.exit(1);
}

// read all files in the directory
const files = readdirSync(mcpDir, { recursive: true });

// filter for .sav files
const savFiles = files.filter((file) => file.endsWith('.sav'));

// check if we found any .sav files
if (savFiles.length === 0) {
  console.error(`ERROR: No .sav files found in ${mcpDir}`);
  console.error(
    'The MCP folder must contain at least one .sav file before packaging.'
  );
  process.exit(1);
}
