const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');

/**
 * Generates the public type declarations for the agents server package.
 *
 * Uses tsc to emit .d.ts files starting from `apps/agents/server/src/types.ts`
 * (edit that file to change what is public), then flattens them into a single
 * folder with no workspace path aliases.
 *
 * Usage: node build-agents-server-types.js <output directory>
 */
const outDir = process.argv[2];
if (!outDir) {
  console.error('Usage: node build-agents-server-types.js <output directory>');
  process.exit(1);
}

const root = process.cwd();
const tscOut = path.join(root, 'dist', 'out-tsc', 'agents-server-types');
fs.rmSync(tscOut, { force: true, recursive: true });

execFileSync(
  process.execPath,
  [
    path.join(root, 'node_modules', 'typescript', 'bin', 'tsc'),
    '-p',
    path.join(root, 'apps', 'agents', 'server', 'tsconfig.types.json'),
  ],
  { cwd: root, stdio: 'inherit' },
);

// emitted files (relative to the repo root) and their flattened names
const emitted = {
  'index.d.ts': 'apps/agents/server/src/types.d.ts',
  'protocol.interface.d.ts': 'apps/agents/server/src/protocol.interface.d.ts',
  'chat-types.interface.d.ts':
    'libs/types/chat/src/lib/chat-types.interface.d.ts',
  'validate-config.interface.d.ts':
    'libs/mcp/agents-server/src/lib/helpers/validate-config.interface.d.ts',
};

// workspace aliases from tsconfig.types.json and where they end up
const aliases = {
  '@idl/mcp/agents-server': './validate-config.interface',
  '@idl/types/chat': './chat-types.interface',
};

fs.rmSync(outDir, { force: true, recursive: true });
fs.mkdirSync(outDir, { recursive: true });

for (const [name, source] of Object.entries(emitted)) {
  let content = fs.readFileSync(path.join(tscOut, source), 'utf-8');

  for (const [alias, local] of Object.entries(aliases)) {
    content = content.split(`'${alias}'`).join(`'${local}'`);
    content = content.split(`"${alias}"`).join(`'${local}'`);
  }

  if (/['"]@idl\//.test(content)) {
    throw new Error(`Unresolved workspace import in ${name}`);
  }

  fs.writeFileSync(path.join(outDir, name), content);
}
