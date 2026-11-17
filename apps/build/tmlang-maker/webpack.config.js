const { createNodeConfig } = require('../../../webpack.node.config');

module.exports = createNodeConfig(__dirname, {
  assets: [
    './src/assets',
    {
      input: 'resources/language/syntaxes/src',
      glob: '**/*',
      output: 'assets',
    },
  ],
  environments: true,
});
