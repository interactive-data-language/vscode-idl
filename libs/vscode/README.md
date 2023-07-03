# libs/vscode

This folder contains all of the libraries that import from `vscode`. The reason for this pattern in that, any library that imports `vscode`, has a testing complexity because `vscode` is not an actual library that exists **unless** the code is running within VS Code.

## Shared Libraries

Here is a list of the shared libraries in this directory. Per the note above, any library that imports from `vscode` needs to be located in the vscode subfolder.

- **client**: Library to help setting up the extension client. Used by the `client` app
- **commands**: Library with shared code for commands we add to VS Code. Actual commands are registered in each lib.
- **debug**: Library containing code related to debugging
- **envi-opener**: Contains code to use ENVI to open specific files
- **server-messages**: Types and interfaces for custom messages between language client and language server in VSCode
- **shared**: Shared routines, data structures, etc between vscode libs.
- **terminal**: Library for working with IDL in a terminal window
- **tree-view**: Library to manage creating the tree view in the IDL extension
- **webview**: Library that manages creation of the webview

## Pattern

All libraries follow the pattern of having a function call that initializes that particular part of the extension. For example, for the `debug` lib:

1. Function `InitializeDebugger` is exported and called in `apps/client/src/main.ts`

2. The function `InitializeDebugger` exports a constant with any shared variables that other libs might need to access

- For example: It creates a constant called IDL which is an object class that can interact with and send commands to an IDL debug session

3. The function `InitializeDebugger` registers any commands related to debugging

- All commands or functionality related to a lib **should** live entirely within that lib. For example: Don't store commands for the terminal somewhere else. This helps keep the code more organized.
