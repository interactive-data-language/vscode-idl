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

// copy over required dependencies
fs.cpSync(
  path.join(process.cwd(), 'node_modules', '@github'),
  path.join(agentServer, 'node_modules', '@github'),
  {
    recursive: true,
    force: true,
  },
);

// copy over built components
fs.cpSync(
  path.join(process.cwd(), 'node_modules', '@koromix'),
  path.join(agentServer, 'node_modules', '@koromix'),
  {
    recursive: true,
    force: true,
  },
);
