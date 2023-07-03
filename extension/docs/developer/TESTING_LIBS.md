# Testing Libs

This doc covers, at a high level, how test generation works for libraries (i.e. not the language server, but the components of the language server).

At a high level, all test generation is entirely automated!

> You do not need to have IDL to test the libs.

## Background: Automation

Yep, you heard it right, test generation is as simple as copy/paste code into the right file, regenerating tests, and having a new one made for you.

Why did we automate the test generation? Simple put: to save time. Some of the tests can be rather large and complex (if not impossible to generate by hand). Some of our larger tests are >1000 lines of code which would be a waste of time/talent to have to make.

## Test Philosophy

Because test generation is automated, when you generate tests, you are capturing the state of the entire code base.

This makes it easy to see, using a Git GUI application, other places that any changes you make as a developer might have inadvertently impacted or changed.

There are three ways then that the test generation is useful:

1. Using the `npm run generate-tests` to regenerate all tests and capture the current state of the code. This is ideal for large changes that impact type detection, parsing, etc. that can have broad implications for the code base.

2. Using the `npm run generate-new-tests` to only make new tests and not update previously created tests with the current state. This always has some risk, but is acceptable to use if you have made very small and targeted changes.

3. When you generate all tests, we also have error checking to make sure there isn't an uncaught exception from the code that we process. This in itself is a test of the code base as we can't make/update tests if we have errors.

## Generating and Running Lib Tests

Here is the process for working with the lib tests.

1. Regenerate all tests to look for changes in behaviors since the last full test generation. If this process fails, or if there are changes, review everything using a Git GUI application.

```shell
npm run generate-tests
```

2. If the above passes, then we run all of the tests for our libraries which _should_ all pass. There are some manual tests for custom edge cases which may fail and/or need to be updated.

> Pro tip: if there are failures, go into the appropriate automated test file and check the source code. There can be occasional problems where a filename has changed in the automated test folders and an old test lingers. These old tests will likely fail as they were made from a previous version of the application.

```shell
npm run test-libs
```
