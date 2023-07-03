# Automated Test Generation

This readme is meant to be a helpful guide for how to create new automated tests for different language-based components of the extension!

At a high level, testing is currently focused **outside** of VSCode where we make sure that, in a purely node.js environment, our code does what we expect.

Eventually, testing the VSCode extension with integration/e2e tests will be a thing, but it isn't right now.

For the purposes of this readme, everything you will need is going to be focused on using the `test-tokenizer` app which lives in `apps/test-tokenizer/src/main.ts`.

## Developing New Language Features

Before getting to how to write new tests, there is a playground for you to easily change code behavior and live-reload changes to view the immediate results. This is using the `tes-tokenizer` app which, apart from the code at the top of the file, is intended as a living document to enable developers to more quickly and rapidly develop features.

> Feel free to stash/have your own changes for this file. It will get updated occasionally, but not too often. The main file has some junk code, so be aware that it may change when updating your code base.

To use this, there are a few simple steps to follow:

1. Start the test tokenizer app using `nx serve test-tokenizer`

2. Once running, make any changes you need to the `apps/test-tokenizer/src/playground-code.ts` file

- This will most likely be updating the variable `PLAYGROUND_CODE` within this file

3. On changes, the app will live-reload and re-run the `Playground` function. you will see output like this when it runs:

```
Parse time (ms): 19.213030993938446

Format time (ms): 2.3881239891052246

Output folder: "/Users/znorman/awesome-vscode-idl/parse-test"
Helpful files in destination:
  "code.js"        contains version of processed code for using in tests
  "formatted.pro"  contains the formatted version of source code
  "global.json"    contains globally available tokens from code
  "local.json"     contains local tokens within routines
  "problems.json"  contains detected syntax problems
  "tokens.json"    contains raw tokens extracted from code
  "tree.json"      contains AST version of tokens with post-processing applied

```

Inspect the output from the process in the files or, for convenience, feel free to add some `console.log()` statements to the `Payground` function.

Once any new language features and complete and working as expected, it is time to generate the tests to verify that functionality keeps behaving the same in the future.

## Writing New Automated Tests

The testing for the extension is VSCode is primarily automated: meaning the tests are automatically generated based on the current state of the code. This does two things:

1. Lets you focus on writing features and not writing tests

2. Provides a checkpoint for regression and, when re-generating tests, it is easy to check and see if your changes have altered other behaviors by looking at the diffs in a git GUI tool like GitKraken or Fork.

> This means that it is absolutely critical that, every time you make automated tests, you go through the results with a fine-toothed comb to check for changes and, if there are changes, verify that they are as intended. Ask for help on this if you need it.

> Really, this is a powerful tool, but you need to take extra care that all intended changes are what you expect!

### Tested Libraries

There are (at the time of writing this) 6 main components that have automated tests written for them. Here is a description of each and where you can find the files which actually have the tests.

- Assembler to verify code formatting and create checkpoints for behavior

  - Located in: `apps/test-tokenizer/src/test-maker/tests/auto-default-assembler-tests.interface.ts`

- Local scope extraction to verify we get variables and docs associated with them

  - Located in: `apps/test-tokenizer/src/test-maker/tests/auto-local-scope-tests.interface.ts`

- Selected token to make sure we correctly identify the token at a given position in code

  - Located in: `apps/test-tokenizer/src/test-maker/tests/auto-selected-token-search.ts`

- Syntax post-processors to verify they correctly post-process our raw tokens

  - Located in: `apps/test-tokenizer/src/test-maker/tests/auto-syntax-post-processor-tests.interface.ts`

- Syntax validators to verify we correct identify (or don't identify) problems in code

  - Located in: `apps/test-tokenizer/src/test-maker/tests/auto-syntax-validator-tests.interface.ts`

- Token test, which are the most critical, to make sure we always initially parse code the right way

  - Located in: `apps/test-tokenizer/src/test-maker/tests/auto-token-tests.interface.ts`

### Adding Tests

Here's the steps to adding new tests and the patterns that should be followed when writing them

1. Based on the library you are adding tests for, find the appropriate file from the list above or find it in the folder `apps/test-tokenizer/src/test-maker/tests`

2. Tests are organized alphabetically by the file name which is written out to disk.

- Either make a new test (auto-complete will tell you what fields you need or copy/paste a file for use) or append to an existing test.

- Output folder for different tests is managed within: `apps/test-tokenizer/src/test-maker/generate-automated-tests.ts`

> Pro tip: If you need to embed code within your test, using the `test-tokenizer` app with your code will generate a file called `parse-test/code.js` that you should be able to copy/paste from

> Style: use back-ticks for strings since the IDL code can have single and double quotes

> Style: trim any excess empty lines before and after the code that you add to the automated tests

3. Once you have made your changes, then run the NPM script `npm run generate-tests`

- This will generate our test files, lint them, and then format the associated libraries so that they have a consistent look and feel with user-written code

4. Verify that all new tests have the behaviors your expect them to: double check your work here as it is critical the automated tests are correct

5. Use you git client of choice to either verify any other changes to test files are correct or adjust code so they have no changes.

6. When finished, commit changes!
