const webpack = require('webpack');

const { createNodeConfig } = require('../../../webpack.node.config');

module.exports = createNodeConfig(__dirname, {
  externalDependencies: 'none',
  // swagger-ui-express serves its static files from a path inside node_modules
  // that doesn't exist once bundled, so copy them next to main.js
  assets: [
    './src/assets',
    {
      input: 'node_modules/swagger-ui-dist',
      glob: '{swagger-ui.css,swagger-ui-bundle.js,swagger-ui-standalone-preset.js,favicon-*.png}',
      output: 'swagger-ui',
    },
  ],
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
