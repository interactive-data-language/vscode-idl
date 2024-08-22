const { composePlugins, withNx } = require('@nx/webpack');

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
  // Update the webpack config as needed here.
  // e.g. `config.plugins.push(new MyPlugin())`
  return config;
});
