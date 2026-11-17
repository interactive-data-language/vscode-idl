const { NxAppWebpackPlugin } = require('@nx/webpack/app-plugin');
const path = require('path');
const webpack = require('webpack');

const isProd = process.env.NX_TASK_TARGET_CONFIGURATION === 'production';
const outputPath = path.join(__dirname, '../../../dist/apps/vscode/client-web');

module.exports = {
  // output path is needed here so Nx can infer the outputs for caching
  output: { path: outputPath },
  externals: [
    {
      vscode: 'commonjs vscode', // ignored because it doesn't exist
    },
  ],
  resolve: {
    fallback: {
      // Ensure Webpack resolves `buffer`
      buffer: require.resolve('buffer/'),
    },
  },
  plugins: [
    new NxAppWebpackPlugin({
      outputPath,
      main: './src/main.ts',
      tsConfig: './tsconfig.app.json',
      assets: ['./src/assets'],
      target: 'webworker',
      compiler: 'tsc',
      mergeExternals: true,
      optimization: isProd,
      outputHashing: 'none',
      sourceMap: false,
      generateIndexHtml: false,
      runtimeChunk: false,
      vendorChunk: false,
      commonChunk: false,
    }),
    // runs after the Nx plugin so it can change what the Nx plugin sets
    {
      apply(compiler) {
        // force to be web
        compiler.options.target = ['webworker'];

        /**
         * Force commonjs
         *
         * For whatever reason, NX changes this from commonjs when
         * web worker is set as the target
         */
        compiler.options.output.libraryTarget = 'commonjs';
      },
    },
    /**
     * These runtime plugins also have type stubs in `./src/globals.d.ts`
     *
     * The type stubs are generic and any to enable compiling. VSCode editing uses
     * types from node, so it doesn't look like a problem
     */
    // provide a shim for the global `process` variable
    new webpack.ProvidePlugin({
      process: 'process/browser',
    }),
    // Make `Buffer` globally available
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
    }),
  ],
};
