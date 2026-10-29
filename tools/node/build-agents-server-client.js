const { buildSync } = require('esbuild');
const fs = require('fs');
const path = require('path');

const {
  BundleAgentsServerDeclarations,
} = require('./bundle-agents-server-declarations');

/**
 * Builds the client for the agents server package, available to consumers
 * as "@idl/agents-server/client".
 *
 * Starts from `apps/agents/server/src/client.ts` and emits:
 * - index.js (CommonJS)
 * - index.mjs (ESM)
 * - index.d.ts
 *
 * The bundle works in Node and the browser. `axios` is not bundled, it is a
 * peer dependency that consumers provide.
 *
 * Usage: node build-agents-server-client.js <output directory>
 */
const outDir = process.argv[2];
if (!outDir) {
  console.error('Usage: node build-agents-server-client.js <output directory>');
  process.exit(1);
}

const root = process.cwd();
const entry = path.join(root, 'apps', 'agents', 'server', 'src', 'client.ts');

fs.rmSync(outDir, { force: true, recursive: true });
fs.mkdirSync(outDir, { recursive: true });

for (const [format, outfile] of [
  ['cjs', 'index.js'],
  ['esm', 'index.mjs'],
]) {
  buildSync({
    entryPoints: [entry],
    outfile: path.join(outDir, outfile),
    bundle: true,
    format,
    platform: 'browser',
    target: 'es2022',
    external: ['axios'],
    tsconfig: path.join(root, 'apps', 'agents', 'server', 'tsconfig.app.json'),
    sourcemap: true,
    logLevel: 'warning',
  });
}

BundleAgentsServerDeclarations(
  path.join('apps', 'agents', 'server', 'src', 'client.ts'),
  outDir,
);
