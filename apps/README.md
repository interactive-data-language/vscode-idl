# Applications

The apps folder represents the nx application that are contained in this repository.

An application is effectively an entry point for TypeScript that gets compiled into a "main.js" file that can be loaded/executed at a later point in time using `node.js`.

This list of applications should be more or less up-to-date with what each is for.

If not, file an issue or make a discussion and we can update it!

Here's what we have so far

- **client**: The extension that runs within VS Code. Adds/manages commands, updating the UI, and starts the language server.

- **client-e2e**: Contains the tests run by vscode-e2e-runner below. All integration tests are just TypeScript with a basic wrapper.

- **i18n**: Library that manages creating the translation files for VS Code. **Everything** that is text shown in the UI should go through translation.

- **idl-docs-parser**: Parses the IDL documentation and creates hover help. Should be updated anytime our global symbols change.

- **idl-webview**: Angular-based application that creates VSCode webviews.

- **idl-webview-e2e**: Not used, end-to-end test framework for idl-webview using browsers (not VSCode).

- **package-json**: Creates the content for the contribution points in the main `package.json` file. Built with typescript and does some basic checks for translations and auxiliary files to make sure we aren't missing anything.

- **parsing-worker**: Node.js worker thread to index IDL code in the background.

- **performance**: Node.js app meant to be a place where we can test the speed of parsing without needing to open VSCode (also, cross platform)

- **server**: The VS Code language server implementation for IDL.

- **test-tokenizer**: An app used for testing the tokenizer and creating our automated tests.

- **tmlang-maker**: Live-reloading application to convert our YAML language config file to plist for VSCode to digest.

- **vscode-e2e-runner**: Basic application that runs our VSCode integration tests which are located in `client-e2e`
