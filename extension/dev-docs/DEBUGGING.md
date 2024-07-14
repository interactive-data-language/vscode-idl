# Debugging

All about running IDL within VSCode! There's some complexity from how VSCode ties everything together.

## Pieces

- Shared library where we register/add debugging functionality to VSCode: `libs\vscode\debug\src\lib\initialize-debugger.ts`

- Once you ask VSCode to start a debug session, a request for debugging configuration is initialized. This comes from the "configuration provider" which is located here: `libs\vscode\debug\src\lib\idl-debug-configuration.ts`

- Then the debug adapter launches IDL and handles requests to get input/output. This happens in: `libs\vscode\debug\src\lib\idl-debug-adapter.class.ts`

- Lastly, the actual IDL session is launched. This class follows patterns for extending the node.js EventEmitter class and emits events when things happen which we listen to in the debug adapter. The IDL session is found here: `libs\idl\src\lib\idl.class.ts`

## Key Notes/Facts

- The configuration provider is responsible for getting/setting any special IDL environment variables for preferences.

- The IDL debug class also makes sure some environment variables are properly set for Windows and Linux/Mac

- Any commands that you want to run in IDL, you need to use the `IDLDebugAdapter::evaluate` method to do so

- UNless inside of `IDLDebugAdapter::evaluate` don't directly send commands to IDL. That is the entry point for consistent behavior such as (.edit and .compile or exit) to nicely handle everything.

- As is, IDL output comes along on separate lines occasionally. You can use the helper function `CleanIDLoutput` to strip all new line characters and trim content returned from IDL. This exists in the library `@idl/idl`
