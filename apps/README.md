# Applications

The apps folder represents the nx applications that are contained in this repository.

An application is effectively an entry point for TypeScript that gets compiled into a "main.js" file that can be loaded/executed at a later point in time using `node.js`.

Apps are grouped into subfolders by purpose. This list should be more or less up-to-date with what each is for.

If not, file an issue or make a discussion and we can update it!

## vscode/

Apps that make up the VS Code extension itself.

- **client**: The extension that runs within VS Code. Adds/manages commands, updating the UI, and starts the language server.

- **client-web**: Web/webworker build of `client` for browser-based VS Code environments (vscode.dev, github.dev).

- **idl-webview**: Angular-based application that creates VSCode webviews.

- **idl-ws**: WebSocket server used to communicate with a running IDL session.

- **parsing-worker**: Node.js worker thread to index IDL code in the background.

- **server**: The VS Code language server implementation for IDL.

## build/

Apps that generate content consumed by the extension at build time.

- **i18n**: Manages creating the translation files for VS Code. **Everything** that is text shown in the UI should go through translation.

- **idl-docs-parser**: Parses the IDL documentation and creates hover help. Should be updated anytime our global symbols change.

- **package-json**: Creates the content for the contribution points in the main `package.json` file. Built with typescript and does some basic checks for translations and auxiliary files to make sure we aren't missing anything.

- **tmlang-maker**: Live-reloading application to convert our YAML language config file to plist for VSCode to digest.

## dev/

Playground/testing utilities, not shipped as part of the extension.

- **sandbox**: Generic sandbox for isolated testing and experimentation.

- **performance**: Node.js app meant to be a place where we can test the speed of parsing without needing to open VSCode (also, cross platform).

## agents/, notebook/, test/

Each of these has its own `README.md` describing its contents:

- [agents/](agents) — the standalone AI agents desktop app, its Angular UI, and their respective e2e tests.
- [notebook/](notebook) — the IDL notebook renderer and its Angular components.
- [test/](test/README.md) — integration test apps: `test-client` (test source), `test-server` (tokenizer/test generation), `vscode-e2e-runner` (runs the `test-client` tests), and `idl` (test fixtures).
