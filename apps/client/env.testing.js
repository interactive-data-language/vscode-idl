const path = require('path');

// set environment variables that will be loaded in ./src/test/run-tests.ts
process.env.VSCODE_IDL_LOGFILE = path.join(__dirname, 'idl.extension.host.log'); // log everything to a file on disk
process.env.VSCODE_IDL_LOG_TO_FILE = 'true';
process.env.VSCODE_IDL_DEBUGGING = 'true'; // verbose logging (everything)
