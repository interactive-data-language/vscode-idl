# Logging

This document quickly outlines how logging works based on the runtime extension in production and development mode.

## Pieces

1. `InitializeClient` contains our logger for the client which, when not in development, uses an output channel to write logs. You can access these logs in the "IDL: Extension Client" output. It also let's you know if debug mode is detected for convenience.

2. A custom server message and log manager interceptor takes everything from the server and sends it to the client. This happens directly within `InitializeServer`.

3. Lastly, the parsing worker thread intercepts any console output and send it via a message to our parent process which then gets logged on the server and travels back up to the client to easily get displayed. The source for this is in `apps/parsing-worker/src/main.ts

## Highlighting

Because, for some reason, you can't nicely format text like you can during development mode for logs, there's a new syntax highlighting file that will capture numbers, strings, objects, etc and display them nicely.

This source is the "idl-log.tmLanguage.yaml" file.
