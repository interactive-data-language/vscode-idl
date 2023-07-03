const webpack = require('webpack');

/**
 * Webpack config used for the client and server for our extension.
 *
 * Primarily to ignore vscode from dependencies and leave everything else
 * at default, but leaves room for customization in the future.
 */

module.exports = (/**@type WebpackConfig*/ config, context) => {
  /**@type WebpackConfig*/
  const newConfig = {
    ...config,
    externals: {
      vscode: 'commonjs vscode', // ignored because it doesn't exist
    },
    // trying to work around https://github.com/facebook/create-react-app/pull/11752
    // ignoreWarnings: [/^warning/i],
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
  // console.log(JSON.stringify(config, undefined, 2));
  return newConfig;
};
