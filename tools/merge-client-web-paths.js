const fs = require('fs');
const path = require('path');

// Load base and extended configs
const baseConfigPath = path.resolve(process.cwd(), './tsconfig.base.json');
const extendedConfigPath = path.resolve(
  process.cwd(),
  './apps/client-web/tsconfig.app.json'
);

/** Read reference config */
const baseConfig = JSON.parse(fs.readFileSync(baseConfigPath, 'utf-8'));

/** Read config that needs to inherit paths */
const extendedConfig = JSON.parse(fs.readFileSync(extendedConfigPath, 'utf-8'));

/** Get back paths */
const base = baseConfig.compilerOptions.paths;

/** Get existing paths in our second config file */
const existing = extendedConfig.compilerOptions.paths;

/** Get all paths that should be shared */
const paths = Object.keys(base);

/** Track if there are changes */
let changes = false;

// check for changes - so we dont always break formatting
for (let i = 0; i < paths.length; i++) {
  if (!(paths[i] in existing)) {
    changes = true;
    break;
  }
}

// exit if no changes
if (!changes) {
  process.exit();
}

// Merge paths
const mergedPaths = {
  ...baseConfig.compilerOptions.paths,
  ...extendedConfig.compilerOptions.paths,
};

// Update extended config
extendedConfig.compilerOptions.paths = mergedPaths;

// Write updated config
fs.writeFileSync(extendedConfigPath, JSON.stringify(extendedConfig, null, 2));
