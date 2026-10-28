const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// make component directory
const componentDir = path.join(process.cwd(), 'components');
if (!fs.existsSync(componentDir)) {
  fs.mkdirSync(componentDir, {
    recursive: true,
  });
}

// agents server for build
const agentServer = path.join(componentDir, 'agents-server');
if (fs.existsSync(agentServer)) {
  fs.rmSync(agentServer, {
    force: true,
    recursive: true,
  });
}
fs.mkdirSync(agentServer, {
  recursive: true,
});

// copy over built components
fs.cpSync(path.join(process.cwd(), 'dist'), path.join(agentServer, 'dist'), {
  recursive: true,
  force: true,
});

// copy over resources
fs.cpSync(
  path.join(process.cwd(), 'resources'),
  path.join(agentServer, 'resources'),
  {
    recursive: true,
    force: true,
  },
);

// copy over compliance
fs.copyFileSync(
  path.join(process.cwd(), 'compliance', '3rdpartylicenses.md'),
  path.join(agentServer, '3rdpartylicenses.md'),
);

// copy over license
fs.copyFileSync(
  path.join(process.cwd(), 'LICENSE.txt'),
  path.join(agentServer, 'LICENSE.txt'),
);

// type declarations for consumers, available as "@idl/agents-server/types"
execFileSync(
  process.execPath,
  [
    path.join(process.cwd(), 'tools', 'node', 'build-agents-server-types.js'),
    path.join(agentServer, 'types'),
  ],
  { cwd: process.cwd(), stdio: 'inherit' },
);

// build the package.json from our template and the copilot SDK we built against
const template = JSON.parse(
  fs.readFileSync(
    path.join(process.cwd(), 'apps', 'agents', 'server', 'package.json'),
    'utf-8',
  ),
);
const sdk = JSON.parse(
  fs.readFileSync(
    path.join(
      process.cwd(),
      'node_modules',
      '@github',
      'copilot-sdk',
      'package.json',
    ),
    'utf-8',
  ),
);

// version comes from the template (developers bump it), the SDK is pinned to what we tested
// npm resolves the SDK's own dependencies and platform-specific optional dependencies
template.dependencies = {
  ...template.dependencies,
  '@github/copilot-sdk': sdk.version,
};

fs.writeFileSync(
  path.join(agentServer, 'package.json'),
  JSON.stringify(template, null, 2) + '\n',
);
