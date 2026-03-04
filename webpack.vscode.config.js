const { composePlugins, withNx } = require('@nx/webpack');
const path = require('path');

/**
 * ABOUT
 *
 * Base webpack file for our apps that need webpack
 *
 * Some issue migrating where this is something that should be set for anything
 * that builds using webpack.
 *
 * Setting this up for a shared webpack file that all of the other configs can use
 */

// Nx plugins for webpack.
module.exports = composePlugins(withNx(), (config) => {
  /**@type WebpackConfig*/
  const newConfig = {
    ...config,
    externals: {
      vscode: 'commonjs vscode', // ignored because it doesn't exist
      expect: 'commonjs expect', // Don't bundle expect, we should be able to get this from node_modules. Importing was causing a error for e2e tests
    },

    // stats: 'none',
    // devtool: 'none',
    // plugins: [
    //   new webpack.SourceMapDevToolPlugin({
    //     exclude: [/vscode-languageserver/i],
    //   }),
    // ],
    // stats: {
    //   hash: true,
    //   timings: false,
    //   cached: false,
    //   cachedAssets: false,
    //   modules: false,
    //   warnings: false,
    //   errors: true,
    //   colors: true,
    //   chunks: true,
    //   assets: false,
    //   chunkOrigins: false,
    //   chunkModules: false,
    //   children: false,
    //   reasons: false,
    // }
  };

  // Find the ForkTsCheckerWebpackPlugin instance
  const tsCheckerPlugin = newConfig.plugins.find(
    (p) => p.constructor.name === 'ForkTsCheckerWebpackPlugin'
  );

  if (tsCheckerPlugin) {
    // Increase memory to 4GB (4096) or 8GB (8192)
    // tsCheckerPlugin.options.typescript.memoryLimit = 8192;
    // tsCheckerPlugin.options.typescript.mode = 'write-references';
    // tsCheckerPlugin.options.async = false;
  }

  if (!config.resolve) {
    config.resolve = {};
  }
  if (!config.resolve.alias) {
    config.resolve.alias = {};
  }
  config.resolve.alias.zod = path.resolve(__dirname, 'node_modules/zod/v3');

  return newConfig;
});
