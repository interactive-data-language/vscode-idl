const { composePlugins, withNx } = require('@nx/webpack');
const webpack = require('webpack');

// Nx plugins for webpack.
module.exports = composePlugins(withNx(), (config) => {
  // // add polyfills for some node libs
  // config.resolve.fallback = {
  //   os: require.resolve('os-browserify/browser'),
  //   path: require.resolve('path-browserify'),
  // };

  // force to be web
  config.target = ['webworker'];

  /**
   * Force commonjs
   *
   * For whatever reason, NX changes this from commonjs when
   * web worker is set as the target
   */
  config.output.libraryTarget = 'commonjs';

  config.externals = {
    vscode: 'commonjs vscode', // ignored because it doesn't exist
  };

  /**
   * These runtime plugins also have type stubs in `./src/globals.d.ts`
   *
   * The type stubs are generic and any to enable compiling. VSCode editing uses
   * types from node, so it doesn't look like a problem
   */
  config.plugins.push(
    // provide a shim for the global `process` variable
    new webpack.ProvidePlugin({
      process: 'process/browser',
    }),
    // provide a shim for the global `Buffer` variable
    new webpack.ProvidePlugin({
      Buffer: 'buffer',
    })
  );

  return config;
});
