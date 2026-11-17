const { createNodeConfig } = require('../../../webpack.node.config');

module.exports = createNodeConfig(__dirname, {
  externalDependencies: 'none',
});
