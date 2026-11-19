const { NxAppWebpackPlugin } = require('@nx/webpack/app-plugin');
const path = require('path');

/**
 * ABOUT
 *
 * Shared webpack config factory for the apps that build with webpack
 *
 * Replaces the options from the removed @nx/webpack:webpack executor. Each app
 * has a webpack.config.js that calls this with its folder. Nx infers the build
 * target from that file and runs webpack-cli from the project folder.
 *
 * The `production` configuration is detected with NX_TASK_TARGET_CONFIGURATION
 */
function createNodeConfig(projectDir, config = {}) {
  const {
    assets = ['./src/assets'],
    environments = false,
    externalDependencies = 'all',
    externals = [],
    generatePackageJson = false,
    production = { optimization: true, extractLicenses: true },
    sourceMap = false,
    target = 'node',
    apply,
  } = config;

  const isProd = process.env.NX_TASK_TARGET_CONFIGURATION === 'production';
  const workspaceRoot = __dirname;
  const outputPath = path.join(
    workspaceRoot,
    'dist',
    path.relative(workspaceRoot, projectDir),
  );

  return {
    // output path is needed here so Nx can infer the outputs for caching
    // the library type must be set here because the Nx plugin runs after webpack
    // normalizes the output options, so its libraryTarget default is ignored and
    // the bundle would not export `activate`/`deactivate`
    output: {
      path: outputPath,
      ...(target === 'node' && { library: { type: 'commonjs' } }),
    },
    externals,
    plugins: [
      new NxAppWebpackPlugin({
        outputPath,
        main: './src/main.ts',
        tsConfig: './tsconfig.app.json',
        assets,
        target,
        compiler: 'tsc',
        externalDependencies,
        generatePackageJson,
        mergeExternals: true,
        optimization: false,
        extractLicenses: false,
        outputHashing: 'none',
        sourceMap,
        ...(isProd && {
          ...production,
          ...(environments && {
            fileReplacements: [
              {
                replace: './src/environments/environment.ts',
                with: './src/environments/environment.prod.ts',
              },
            ],
          }),
        }),
      }),
      // runs after the Nx plugin so it can change what the Nx plugin sets
      ...(apply ? [{ apply }] : []),
    ],
  };
}

module.exports = { createNodeConfig };
