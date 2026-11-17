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
  },
});
