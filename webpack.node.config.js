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
  /**
   * This was added after a recent update to NX 21 (latest) that needed this for builds to work
   */
  // Find and update ForkTsCheckerWebpackPlugin with increased memory limit
  const forkTsCheckerIndex = config.plugins.findIndex(
    (plugin) => plugin.constructor.name === 'ForkTsCheckerWebpackPlugin'
  );

  if (forkTsCheckerIndex !== -1) {
    // Replace existing plugin with increased memory limit
    config.plugins[forkTsCheckerIndex] = new ForkTsCheckerWebpackPlugin({
      typescript: {
        memoryLimit: 8192,
      },
    });
  } else {
    // Add plugin with increased memory limit if not present
    config.plugins.push(
      new ForkTsCheckerWebpackPlugin({
        typescript: {
          memoryLimit: 8192,
        },
      })
    );
  }

  return config;
});
