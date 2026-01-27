const { readFileSync, existsSync } = require('fs');
const { join, delimiter, sep } = require('path');
const { spawnSync } = require('child_process');

/** Build.json file at the root folder */
const buildJsonPath = join(process.cwd(), 'build.json');

/**
 * Main function to update MCP tools
 */
function updateMcpTools() {
  let buildConfig;

  try {
    const buildJsonContent = readFileSync(buildJsonPath, 'utf-8');
    buildConfig = JSON.parse(buildJsonContent);
  } catch (error) {
    throw new Error(
      `Failed to read or parse build.json at ${buildJsonPath}: ${error.message}`
    );
  }

  // Validate required keys
  if (!buildConfig['mcp-dir']) {
    throw new Error('build.json must contain "mcp-dir" key');
  }

  if (!buildConfig['idl-dir']) {
    throw new Error('build.json must contain "idl-dir" key');
  }

  if (!existsSync(buildConfig['mcp-dir'])) {
    throw new Error('build.json "mcp-dir" does not exist');
  }

  if (!existsSync(buildConfig['idl-dir'])) {
    throw new Error('build.json "idl-dir" does not exist');
  }

  const env = {
    ...process.env,
    IDL_FOR_VSCODE: process.cwd(),
    IDL_PATH: `${join(process.cwd(), 'idl', 'vscode')}${delimiter}${
      buildConfig['mcp-dir']
    }${delimiter}<IDL_DEFAULT>;`,
  };

  const result = spawnSync(
    `idl`,
    ['-e', `".run '${buildConfig['mcp-dir']}${sep}build.pro'"`],
    {
      env,
      cwd: buildConfig['idl-dir'],
      shell: true,
      stdio: 'inherit',
    }
  );

  // Step 4: Throw an error if there were problems
  if (result.error) {
    throw new Error(`Failed to spawn IDL executable: ${result.error.message}`);
  }

  if (result.status !== 0) {
    throw new Error(
      `IDL executable exited with non-zero status code: ${result.status}`
    );
  }

  console.log('MCP tools updated successfully!');
}

// return if no file
if (!existsSync(buildJsonPath)) {
  process.exit(0);
}

// Execute the main function
try {
  updateMcpTools();
  process.exit(0);
} catch (error) {
  console.error('Error updating MCP tools:', error.message);
  process.exit(1);
}
