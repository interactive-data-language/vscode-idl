# Testing Design

Testing for the VSCode extension is a little complicated considering the number of places that tests live.

In general, there are three components to testing:

1. NX Library testing where we verify capabilities in a specific lib work as expected

- Follows NX patterns, primarily limited to `libs/parsing` and `libs/assembling` where a majority of the capabilities live for the server

2. NX app testing

- Follows NX patterns. This is only done for tmlang-maker to verify the TextMate parsing has some regression tests.

3. VSCode integration tests tying together the client, server, and debugging

- Pseudo follows VSCode patterns (see below for more details)

## Integration Tests

For VSCode, integration tests have two components:

1. The test runner/manager: `apps/vscode-e2e-runner/src/main.ts`

Straight from the VSCode docs, this NX app orchestrates downloading and launching VSCode then loading our tests

2. The actual tests: `apps/client-e2e/src/main.ts`

Borrowed from the VSCode docs, but does not use Jest or Mocha to run tests. The problem here is that, because we use NX and share code between libraries and applications, we can't simply follow the patterns that NX and Jest or VSCode and Mocha follow.

Instead, we borrow from the fundamental concept that all tests are is code that runs and raises an exception if something doesn't do what we expect it to do. We created a very basic helper class to run tests for us located in `apps/client-e2e/src/tests/runner.class.ts` which manages executing tests. The tests are added by test type (for example, see debugging tests located in `apps/client-e2e/src/tests\debugging/_debugging-runner.ts`) and then executed int he order they are added to the main runner. Tests are registered and run in `apps/client-e2e/src/tests/runner.ts`

### Running Integration Tests

1. Start the client and server (use `npm start` or launch two terminals with `npm run start-server` and `npm run start-client`)

Zach prefers to use two separate terminals, easier to read compile errors if there are some. Pick your poison though!

2. Start the tests using `npm run start-test`

Live reloads any tests/changes from our test runner located in `apps/client-e2e/src/main.ts`

3. Run the integration tests using `npm run integration-test`

Which launches the vscode-e2e-runner app, downloads VSCode, and runs the tests compiled in the steps above
