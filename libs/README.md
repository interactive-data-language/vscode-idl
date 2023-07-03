# libs

This folder contains all of the code shared between libs and the apps

> IMPORTANT NOTE: If a lib imports from `vscode` then it needs to be in the `vscode` subfolder

## Shared Libraries

Not everything is captured here, but all sub-folders should have README files with details about each folder and, if you dig into each library, there will also be a README with basic information about what it contains.

Here is a list of the shared libraries in this directory. Per the note above, any library that imports from `vscode` needs to be located in the vscode subfolder. The reason for this pattern in that, any library that imports vscode, has a testing complexity because vscode is not an actual library that exists **unless** the code is running within the extension client.

- **assembling**: Code for assembling things we parse as code again
- **data-types/core**: Core of logic for parsing and creating IDL types.
- **data-types/tasks**: Types and helper routines for ENVI and IDL task files.
- **debug-types**: Type definitions used for debugging and shared with the `id-webview` app
- **generators**: Code that generates things (like tasks and idl.json files)
- **idl**: Creates a spawned instance of IDL that you can interact with
- **logger**: Library that manages a simple logger to print content to the console
- **parsing**: Utilities related to parsing IDL code and identifying syntax errors
  - **index**: The main entry point for indexing IDL code, tracking tokens and syntax problems.
  - **parser**: Main entry point for parsing IDL code and detecting syntax errors.
  - **problem-codes**: Standalone library containing the problem codes from parsing, syntax validation, and type detection.
  - **routines**: Defaults and shortcuts for routines (such as constants that can track all display names).
  - **syntax-post-processors**: Plug-in library to add post-processing to the syntax tree creation and map tokens to the types they should be. Helps reduce the number of tokens the tokenizer looks for and adds flexibility.
  - **syntax-tree**" Manages creating the syntax tree from tokens in the code
  - **syntax-validators**: This library add our syntax checkers to the syntax tree when imported alongside the syntax-tree.
  - **tokenizer**: Library for parsing and converting code into tokens
  - **tokenizer-types**: Shared types for the tokenizer
- **shared**: Shared types for use in any libs
- **test-helpers**: Helper code to be used in tests/testing
- **translation**: Everything related to translation
- **vscode**: Folder containing any library that imports from `vscode`, see more in the README inside the `vscode` folder
  - **client**: Library to help setting up the extension client. Used by the `client` app
  - **config**: Manages config for the VSCode extension
  - **debug**: Code to manage launching a debug session of IDL
  - **docs**: Basic addition to VSCode for the extension's documentation
  - **envi-opener**: Manages file support for imagery and attempts to open them in ENVI on open in VSCode
  - **events**: Contains custom event libs for the client and language server
    - **client**: Lib for managing events in the VSCode client
    - **messages**: Shared types for messages coming to/from language server
    - **server**: Lib for managing events in the language server
  - **extension-config**: Configuration for the VSCode extension (types, defaults, etc.).
  - **help-view**: Not used, but placeholder to create a custom view for the extension documentation
  - **initialize-types**: Types for return values from initializing each part of the extension. Primarily for testing.
  - **server**: Language server for VSCode
  - **shared**: Shared code that interacts with VS Code and available to all libs
  - **terminal**: DEPRECATED Library for working with IDL in a terminal window
  - **tree-view**: Library to manage creating the tree view in the IDL extension
  - **webview**: Library that manages creation of the webview
  - **webview-shared**: Shared data types for the IDL webview and the VSCode extension client.
- **workerio**: Library that contains helper classes to assist with starting new worker threads and sending work to them
- **workers**: Code that manages worker threads and messaging between them and the parent process.
  - **parsing**: Types (messages, payloads, and responses) for the parsing worker
  - **vscode**: Library for future types (messages, payloads, and responses) between the LSP and VSCode
  - **workerio**: Core library with messaging classes, and override-able interfaces for messages between parent and child processes.
