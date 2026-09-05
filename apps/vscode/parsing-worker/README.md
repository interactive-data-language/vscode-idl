## parsing-worker

This application creates a worker thread using the workerio lib to normalize communication and error catching to extract tokens from a pool of workers.

This is used as part of the `parsing-index` lib to quickly process all IDL code in folders and workspaces. Additionally, this helps keep the main server thread free and performant.

> Note: Because this is an nx app, you will need to use `nx build parsing-worker --watch` to build this and live-reload on changes in order for changes to the parsing code to be used at runtime or during development.
