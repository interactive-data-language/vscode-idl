const { createNodeConfig } = require('./webpack.node.config');

/**
 * ABOUT
 *
 * Shared webpack config factory for apps that run inside VSCode
 *
 * Same as the node config, but `vscode` and `expect` are not bundled
 */
function createVscodeConfig(projectDir, config = {}) {
  return createNodeConfig(projectDir, {
    ...config,
    externals: [
      {
        // vscode is provided by the host and doesn't exist on disk
        vscode: 'commonjs vscode',
        // importing expect was causing an error for e2e tests
        expect: 'commonjs expect',
      },
      ...(config.externals || []),
    ],
  });
}

module.exports = { createVscodeConfig };
