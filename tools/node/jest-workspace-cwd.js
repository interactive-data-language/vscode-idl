const { resolve } = require('path');

// tests resolve extension files from process.cwd(), so run them from the workspace root
process.chdir(resolve(__dirname, '../..'));
