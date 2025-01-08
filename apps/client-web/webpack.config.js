const { composePlugins, withNx, devServerExecutor } = require('@nx/webpack');

// Nx plugins for webpack.
module.exports = composePlugins(
  withNx({
    target: 'web',
  }),
  (config) => {
    // add polyfills for some node libs
    config.resolve.fallback = {
      os: require.resolve('os-browserify/browser'),
      path: require.resolve('path-browserify'),
    };

    config.externals = {
      vscode: 'commonjs vscode', // ignored because it doesn't exist
    };

    return config;
  }
);
