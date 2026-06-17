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
  // Find the ForkTsCheckerWebpackPlugin instance
  // const tsCheckerPlugin = config.plugins.find(
  //   (p) => p.constructor.name === 'ForkTsCheckerWebpackPlugin'
  // );

  // if (tsCheckerPlugin) {
  // Increase memory to 4GB (4096) or 8GB (8192)
  // tsCheckerPlugin.options.typescript.memoryLimit = 8192;
  // tsCheckerPlugin.options.typescript.mode = 'write-references';
  // tsCheckerPlugin.options.async = false;
  // }

  // Native Node.js addon binaries (.node files) cannot be bundled by webpack.
  // Packages like onnxruntime-node and @anush008/tokenizers use napi-rs and
  // ship pre-compiled platform-specific binaries that must be loaded at runtime
  // from node_modules. A function-based external catches all of them by pattern.
  const existingExternals = config.externals ?? [];
  config.externals = [
    ...(Array.isArray(existingExternals)
      ? existingExternals
      : [existingExternals]),
    ({ request }, callback) => {
      if (
        request === 'onnxruntime-node' ||
        /^@anush008\/tokenizers/.test(request) ||
        request.endsWith('.node')
      ) {
        return callback(null, 'commonjs ' + request);
      }
      callback();
    },
  ];

  return config;
});
