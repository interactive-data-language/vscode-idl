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
const toExtend = extendedConfig.compilerOptions.paths;

/** Get all paths that should be shared */
const sharedPaths = Object.keys(base);

/** Track if there are changes */
let changes = false;

// check for changes - so we dont always break formatting
for (let i = 0; i < sharedPaths.length; i++) {
  if (!(sharedPaths[i] in toExtend)) {
    changes = true;
    break;
  }
}

/** Get all paths in the file to merge */
const existingPaths = Object.keys(toExtend);

// check for changes - so we dont always break formatting
for (let i = 0; i < existingPaths.length; i++) {
  if (!(existingPaths[i] in base)) {
    changes = true;
    break;
  }
}

// exit if no changes
if (!changes) {
  process.exit();
}

// check for changes - so we dont always break formatting
for (let i = 0; i < existingPaths.length; i++) {
  if (existingPaths[i].startsWith('@idl')) {
    delete toExtend[existingPaths[i]];
  }
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
