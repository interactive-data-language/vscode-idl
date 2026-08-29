// Prefer CJS ("main") entry points over ESM ("module"/"es2015") ones.
//
// nx-electron's default resolve.mainFields puts 'module' before 'main', which is a
// browser-bundling convention. For an Electron main-process (Node) target this causes
// webpack to pick ESM builds of dual-published packages (e.g. flexsearch), which can
// contain `import.meta` even in unreachable code paths. Node's module-type auto-detection
// treats the mere presence of `import.meta`/`import`/`export` syntax anywhere in a bundled
// CommonJS file as a signal to load it as an ES module, breaking `require()` at runtime.
module.exports = (config) => {
  config.resolve.mainFields = ['main'];
  // exports map "import" condition wins over mainFields regardless of the above,
  // so also force the "require" condition to avoid picking ESM entries.
  config.resolve.conditionNames = ['require', 'node', 'default'];

  // Ensure config.externals exists as an array
  config.externals = config.externals || [];

  const externalPatterns = [
    /^@koromix\/.*$/, // Exclude koffi & subpaths
    /^@github\/.*$/, // Exclude all @github/* scoped modules
  ];

  if (Array.isArray(config.externals)) {
    config.externals.push(...externalPatterns);
  } else {
    config.externals = [config.externals, ...externalPatterns];
  }

  return config;
};
