const { composePlugins, withNx } = require('@nx/webpack');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

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

  /**
   * This was added after a recent update to NX 21 (latest) that needed this for builds to work
   */
  // Find and update ForkTsCheckerWebpackPlugin with increased memory limit
  const forkTsCheckerIndex = newConfig.plugins.findIndex(
    (plugin) => plugin.constructor.name === 'ForkTsCheckerWebpackPlugin'
  );

  if (forkTsCheckerIndex !== -1) {
    // Replace existing plugin with increased memory limit
    newConfig.plugins[forkTsCheckerIndex] = new ForkTsCheckerWebpackPlugin({
      typescript: {
        memoryLimit: 8192,
      },
    });
  } else {
    // Add plugin with increased memory limit if not present
    newConfig.plugins.push(
      new ForkTsCheckerWebpackPlugin({
        typescript: {
          memoryLimit: 8192,
        },
      })
    );
  }

  return newConfig;
});
