const webpack = require('webpack');

const { createNodeConfig } = require('../../../webpack.node.config');

module.exports = createNodeConfig(__dirname, {
  externalDependencies: 'none',
  generatePackageJson: true,
  production: {},
  sourceMap: true,
  externals: [
    /^@koromix\/.*$/, // Exclude koffi & subpaths
    /^@github\/.*$/, // Exclude all @github/* scoped modules
  ],
  apply(compiler) {
    compiler.options.output = {
      ...compiler.options.output,
      ...(process.env.NODE_ENV !== 'production' && {
        clean: true,
        devtoolModuleFilenameTemplate: '[absolute-resource-path]',
      }),
    };

    // makes main.js executable when installed as an npm package (npx / bin)
    compiler.options.plugins.push(
      new webpack.BannerPlugin({
        banner: '#!/usr/bin/env node',
        raw: true,
        entryOnly: true,
      }),
    );
  },
});
