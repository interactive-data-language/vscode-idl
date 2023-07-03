# Architecture

This Markdown file contains a high-level overview of the architecture for the extension

The extension is broken up into two components: client and server. The client manages user interactions within the VSCode interface and the server manages language features such as formatting, problem detection, hover help, and other interactions related to the code itself.

At a high level, here is where different components reside within the extension

- Client: `apps/client/src/main.ts`

  - Runs code in (Zach thinks) the main VSCode process

    - Business logic for extension happens here in the lib (follow initialize functions): `libs/vscode/client/src/lib/initialize-client.ts`

      - Creates buttons, adds commands, generates our sidebar tab, adds the icon in the bottom to run a debug session of IDL. Follow the "Initialize" function calls in the main routine to find the other libs and what they register.

  - Manages the debug session where the lib is located here: `libs/vscode/debug/src/lib/initialize-debugger.ts`

    - Almost positive this runs in the main VSCode process, could need to be moved to language server if performance ever becomes a problem, but the actual IDL process is running in another thread via `spawn` in node.js

      - The object class that interacts (sends input and output from IDL) is located here: `libs/idl/src/lib/idl.class.ts`

  - Starts and manages the connection to the language server (see below)

    - This is really nice because it allows us to send custom messages back and forth for a rich user experience (i.e. alert user when there is a problem with the language server or prompt user for input to be used in the language server)

- Server: `apps/server/src/main.ts`

  - Runs code in a separate process via Language Server Protocol using VSCode's NPM packages to create and simplify the communication between the client and the process.

  - Handles the intensive language features and the creation of them is located here: `libs/vscode/server/src/lib/initialize-server.ts`

    - Creation of and interaction with an index (think search index) of the IDL code, tokens, and problems for one or more workspaces.

      - The index is located here: `libs/parsing/index/src/lib/index.class.ts`

      - The index stores everything in-memory and can use 1-2 GB depending on how much code and metadata has been extracted. This is an OK compromise to enable lightning-fast performance and because there aren't any simple-to-set-up-and-use cross-platform file system databases that can be installed with NPM.

    - The user-interaction all occurs in the main thread, but parsing code and initial problem checking happens in a pool of node.js worker_threads to increase performance and reduce latency for a better user experience.

      - Worker threads are created within a separate app as it needs a separate node process. Note: in the future we could use the app for the server and simply catch command line flags to change what action happens on startup. This could help reduce complexity, but it is also nice to be verbose and keep things separate and organized.

        - App for worker threads: `apps/parsing-worker/src/main.ts`

        - Lib that manages the communication between the language server and the worker threads: `libs/workerio/src/index.ts`

          - Best to look in the worker thread app and the index code to see how communication and work gets managed between processes.
