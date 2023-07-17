# Language Server Crashes

This doc is a basic guide to walk through known issues with the language server and how you can work around them.

If you see errors such as " Connection to the language server got closed" or "The connection unexpectedly closed" means that there was a hard crash for the language server that requires a refresh of VSCode to start again.

At the time of writing this doc, the only known cause for this error is the server running out-of-memory.

## Workarounds: Memory Reduction

There are two ways to work around the language server memory errors.

### Using Node.js (recommended)

When the IDL extension starts, if it finds node.js on your path, it will automatically start the language server using node, which should remove this limitation. If you still see memory errors, then reach out to us on GitHub and let us know.

To install node.js, get the latest v18 release from https://nodejs.org/en/download/releases.

Once you install node.js, completely close and re-start VSCode (you may need to restart your computer so that it appears on your path).

### Setting: Full Parse

We added an experimental feature which changes the way that we parse code on language server startup.

If you disable the "Language Server: Full Parse" setting then you should have much lower memory usage and faster startup times for large repositories or search paths.

However, it is experimental and you won't receive full diagnostics for a file until you start editing. But basic functionality such as go-to definition and hover help should work just fine.
