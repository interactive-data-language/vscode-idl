# Release Testing

Before creating a release, we have a few actions that we need to complete first. Here is an outline from the commands to run and why they are important.

> You need to have IDL in order to test the release.

## Process

Here are the steps to run. We can automate this, but there are manual validations that require eyes on it.

1. Regenerate all tests to look for changes in behaviors since the last full test generation. If this process fails, or if there are changes, review everything using a Git GUI application.

```shell
npm run generate-tests
```

2. If the above passes, then we run all of the tests for our libraries which _should_ all pass. There are some manual tests for custom edge cases which may fail and/or need to be updated.

> Pro tip: if there are failures, go into the appropriate automated test file and check the source code. There can be occasional problems where a filename has changed in the automated test folders and an old test lingers. These old tests will likely fail as they were made from a previous version of the application.

```shell
npm run test-libs
```

3. Run integration tests (limited scope) which make sure the extension installs, activates, and some basic commands (like starting IDL) work and do the right thing.

> This is pretty slow on Windows. For whatever reason, it takes 10 seconds for command line IDL to boot sometimes. That's longer than starting the ENVI UI on Windows 11.

```shell
# make the test runners
npm run make-integration-tests

# run the tests
npm run test-integration
```

## Automated Process

You can manually trigger everything as well.

> If you do this, pay close attention to the tests that were re-generated to make sure there were no inadvertent changes. As long as everything passes, and there are no changes, then you are all set.

```shell
npm run test-everything
```
