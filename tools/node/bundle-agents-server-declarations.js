const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');

/**
 * Aliases that point at narrow files so that bundling declarations does not
 * pull in the entire implementation of a library
 */
const NARROW_ALIASES = {
  '@idl/mcp/agents-server': [
    'libs/mcp/agents-server/src/lib/helpers/validate-config.interface.ts',
  ],
};

/**
 * Bundles the type declarations for an entry file of the agents server package
 * into a single `index.d.ts` with no workspace path aliases.
 *
 * @param {string} entry Entry file, relative to the repo root
 * @param {string} outDir Output directory, `index.d.ts` is written here
 */
function BundleAgentsServerDeclarations(entry, outDir) {
  const root = process.cwd();
  fs.mkdirSync(outDir, { recursive: true });
  const outFile = path.join(outDir, 'index.d.ts');

  // workspace config with the narrow aliases applied (paths are not merged by "extends")
  const base = JSON.parse(
    fs
      .readFileSync(path.join(root, 'tsconfig.base.json'), 'utf-8')
      .replace(/^\s*\/\/.*$/gm, ''),
  );
  const tsconfig = path.join(root, 'dist', 'tsconfig.agents-server-dts.json');
  fs.mkdirSync(path.dirname(tsconfig), { recursive: true });
  fs.writeFileSync(
    tsconfig,
    JSON.stringify({
      compilerOptions: {
        ...base.compilerOptions,
        rootDir: root,
        baseUrl: root,
        paths: { ...base.compilerOptions.paths, ...NARROW_ALIASES },
        types: [],
      },
      files: [path.join(root, entry)],
    }),
  );

  try {
    execFileSync(
      process.execPath,
      [
        path.join(
          root,
          'node_modules',
          'dts-bundle-generator',
          'dist',
          'bin',
          'dts-bundle-generator.js',
        ),
        '--project',
        tsconfig,
        '--no-check',
        '-o',
        outFile,
        path.join(root, entry),
      ],
      { cwd: root, stdio: 'inherit' },
    );
  } finally {
    fs.rmSync(tsconfig, { force: true });
  }

  if (/['"]@idl\//.test(fs.readFileSync(outFile, 'utf-8'))) {
    throw new Error(`Unresolved workspace import in ${outFile}`);
  }
}

module.exports = { BundleAgentsServerDeclarations };
