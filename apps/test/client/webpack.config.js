const { createVscodeConfig } = require('../../../webpack.vscode.config');

module.exports = createVscodeConfig(__dirname, {
  externalDependencies: 'none',
  assets: [],
  environments: true,
});
