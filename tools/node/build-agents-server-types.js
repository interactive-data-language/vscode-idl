const fs = require('fs');
const path = require('path');

const {
  BundleAgentsServerDeclarations,
} = require('./bundle-agents-server-declarations');

/**
 * Generates the public type declarations for the agents server package.
 *
 * Starts from `apps/agents/server/src/types.ts` (edit that file to change
 * what is public) and bundles everything into a single file with no workspace
 * path aliases.
 *
 * Usage: node build-agents-server-types.js <output directory>
 */
const outDir = process.argv[2];
if (!outDir) {
  console.error('Usage: node build-agents-server-types.js <output directory>');
  process.exit(1);
}

fs.rmSync(outDir, { force: true, recursive: true });
BundleAgentsServerDeclarations(
  path.join('apps', 'agents', 'server', 'src', 'types.ts'),
  outDir,
);
