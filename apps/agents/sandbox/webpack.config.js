const { composePlugins, withNx } = require('@nx/webpack');

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

    // Ensure config.externals exists as an array
    config.externals = config.externals || [];

    const externalPatterns = [
      /^@koromix\/.*$/, // Exclude koffi & subpaths
      /^@github\/.*$/, // Exclude all @github/* scoped modules
    ];

    if (Array.isArray(config.externals)) {
      config.externals.push(...externalPatterns);
    } else {
      config.externals = [config.externals, ...externalPatterns];
    }

    // Update the webpack config as needed here.
    // e.g. `config.plugins.push(new MyPlugin())`
    return config;
  },
);
