# Testing Client

This document contains details on how to test the vscode extension client for IDL.

## Background

For high-level structure, please read the following page:

https://code.visualstudio.com/api/working-with-extensions/testing-extension

## Running Tests

Running Tests has two NPM scripts that you will need to run:

1. `npm run make-integration-tests` to build our test runner (see below for more details) and build the latest version of the extension.

2. `npm run test-integration` to run the tests. You should see VSCode pop up and flash a bit as files open and tests run.

## Test Components

There are two parts to testing the extension. There is some added complexity because we use NX and share our code in separate TypeScript libraries.

1. The NX app "client-e2e" exports a function called "run" that handles running tests (WIP, not done)

2. The NX app "vscode-e2e-runner" initiates the "client-e2e" tests, after building it, and manages downloading VSCode and running tests

We use separate apps because we mst bundle all dependencies into a single JS file so that our tests can properly run (i.e. all of our source code doesn't just live in a single folder and built as individual JS files using the barebones `tsc` compiler).

### Writing Tests

> Critically important!!

Be very careful what your tests use. You **CANNOT** import constants from the lib folder in your tests. This is because the constants you import are **NOT** the same ones that are populated with values in the extension client.

Instead, any information/constants needed for test **MUST** be returned by the activation function.

Where value needs to be returned: `apps/client/src/main.ts`

Source file for what is returned: `libs/vscode/client/src/lib/initialize-client.interface.ts`

If you use constants for commands or helper routines, that is not a problem, just be aware that you have two instances of code "running" that are sandboxed from one another.

### Basic Usage

Here's how to run tests right now.

> This is a work in progress and will be updated as we progress

1. Start the client tests in build mode with live-reloading:

```shell
npm run start-test
```

2. (Optional if not done already) Build the VSCode extension with live reloading:

```shell
npm start
```

3. Execute the tests by running the main JS file built from the "vscode-e2e-runner" app

```shell
npm run integration-test
```

4. View console output and watch VSCode for any indications of failures/problems.

### Debugging Tests

If you have problems with tests, using the live-reload from above is the best way to try and debug it.

Apart from that, I would suggest that you adjust the constants at the top of `apps/client-e2e/src/main.ts` to allow printing from extension logs and printing debug statements.

If there are any unknown problems, this is the best way to try and track them down.
