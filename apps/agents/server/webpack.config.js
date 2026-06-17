const { composePlugins, withNx } = require('@nx/webpack');
const path = require('path');

// Nx plugins for webpack.
module.exports = composePlugins(
  withNx({
    target: 'node',
  }),
  (config) => {
    config.output = {
      ...config.output,
      ...(process.env.NODE_ENV !== 'production' && {
        clean: true,
        devtoolModuleFilenameTemplate: '[absolute-resource-path]',
      }),
    };
    config.devtool = 'source-map';

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

    // Update the webpack config as needed here.
    // e.g. `config.plugins.push(new MyPlugin())`
    return config;
  },
);
