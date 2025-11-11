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
  /**@type WebpackConfig*/
  const newConfig = {
    ...config,
    externals: {
      vscode: 'commonjs vscode', // ignored because it doesn't exist
    },
    // Suppress warnings from third-party libraries
    ignoreWarnings: [
      // Suppress UMD require warnings from vscode-languageserver-types
      /Critical dependency: require function is used in a way in which dependencies cannot be statically extracted/,
      // Suppress dynamic require warnings from express
      /Critical dependency: the request of a dependency is an expression/,
      // Suppress optional peer dependency warnings from ws library
      /Module not found: Error: Can't resolve 'bufferutil'/,
      /Module not found: Error: Can't resolve 'utf-8-validate'/,
    ],
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
  return newConfig;
});
