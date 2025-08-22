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

/**
 * Extract any keys that aren't from our lib (i.e. will have polyfills)
 */
const saveThese = {};

/** Get all paths in the file to merge */
const existingPaths = Object.keys(toExtend);

// delete any changed libraries
for (let i = 0; i < existingPaths.length; i++) {
  // check for polyfill and not local library
  if (!existingPaths[i].startsWith('@idl')) {
    saveThese[existingPaths[i]] = toExtend[existingPaths[i]];
    delete toExtend[existingPaths[i]];
    continue;
  }

  // remove if lib is not in existing source
  if (!(existingPaths[i] in base) && existingPaths[i] in toExtend) {
    delete toExtend[existingPaths[i]];
    changes = true;
  }
}

/** Get all paths that should be shared */
const sharedPaths = Object.keys(base);

/** Track if there are changes */
let changes = false;

// add any missing libraries
for (let i = 0; i < sharedPaths.length; i++) {
  if (!(sharedPaths[i] in toExtend)) {
    toExtend[sharedPaths[i]] = base[sharedPaths[i]];
    changes = true;
  }
}

// exit if no changes
if (!changes) {
  process.exit();
}

// Update extended config
extendedConfig.compilerOptions.paths = { ...toExtend, ...saveThese };

// Write updated config
fs.writeFileSync(extendedConfigPath, JSON.stringify(extendedConfig, null, 2));
