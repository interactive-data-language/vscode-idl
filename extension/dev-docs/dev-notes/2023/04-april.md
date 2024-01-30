# Changes

## Auto AutoComplete

This should mostly trigger automatically now. We need a "wordPatter" in `language-configuration.ts` and I **think** `triggerCharacters` in our initialization result from `initialize-server.ts`.

Either way, no more manual triggering. Might have performance implications, but it is pretty fast so hopefully not.

## AutoComplete Cursor

We found a way to move the cursor after auto-complete happens. This puts our cursor in the right place for function methods when we do, or don't, add in parentheses because they exist already.

## Tests

Fixed some broken tests from updates/changes (the manual tests that we don't auto-update).

Removed a lingering test that no longer existed, but did not get cleaned up from our automated test generation which were causing false failures.

Updated the docs for testing our VSCode integration and updated the scripts. There are now two scripts which will make all the test runners and another to run them.

## Configuration

Fixed some lingering bugs with the extension configuration (the reason we made sure tests were up to date). The stupid class/interface that VSCode uses does **not** error when you access an invalid config property.

We tweaked a few places we used this to use the proper interface that will throw compile errors if we access an invalid property.

## Types, Types, and More Types!

Open this folder as a workspace to see more, including types and error validation: `idl/test/type-playground`

This has been a very heavy type detection and type validation month! A lot of leg work for getting the framework in place to work with more advanced type use cases.

> This is absolutely not finished. There will likely be bugs, and I tried to be lenient with error reporting so we weren't over zealous reporting more than we should. But it is a good start!

We are now getting a strong base for detecting types from almost all remaining cases, minus a few, when we have assignment.

This includes types from:

- Indexing variables (primarily known indexers such as arrays, lists, etc)

  Also includes validation for indexing, including known types that we can't index

  Smart enough to know when we have an array present for indexing (includes slicing and asterisks) and returns the original type.

- Type promotion!

  If we have a smattering of statements, and they are separated by operators, we can now determine the type.

  For known types, such as lists or hashes, we throw errors if not all arguments can be combined.

  We also have basic logic to tell users what can't, or likely can't be operated on (errors and warnings where applicable).

  If we have arrays, we return arrays with type-promotion applied between scalars and what should be in the arrays.

  If an array has non-standard types, such as an array of ENVIRasters, you get a warning that it might not work.

- Pointer de-referencing

  A little bit of magic here, built on everything above, works with nested types.

One of the other goodies we have, but no validation for, is we have many places where we determine the type, which also validates statements based on their types. This makes sure things on both sides of the equals sign are good, as long as you have type information.

## Tests, Tests, and More Tests!

We have the basic test framework for all problems detected above.

We are also working to make sure that, for problem detection, we properly return the "any" type and use that so, if you have a problem in your code, it doesn't break how we parse and provide user experience for it.

We had a pretty big test gap that didn't catch (or got lost in the number of tests) for type parsing being incorrect. This has been remedied and we now add some regression tests to improve coverage as part of our local/global/etc. tests.

Any changes to type parsing should now apparently create changes in tests with some more complex types.

This also includes developer docs and new package.json scripts for automating the entire test process for libs and integration (which is limited right now).

Test generators were also fixed due to broken behavior because of our first auto-fixed problem!

## Re-worked Type Helper Routines

We now have more, and more concise helper routines for types. Things that return keywords, or routine definitions, from a given token.

This is critical to help support types and any additional validation that we might need for types.

We also updated hover help, token definition, and auto-complete to use as much overlapping capability to reduce code paths here.

## AutoComplete and Hover Help Magic

We cleaned up the logic used in auto-complete for the function `GetTypeBefore` which now utilizes a generic `TypeFromTokens` function.

This function is the beating heart of our type detection and provides a much more robust type detection process which should be as close to perfect as we can get.

## Initial Thoughts for Type Syntax

See `extension/docs/developer/type-concepts/TYPE_SYNTAX.md` for more details

## Ternary (Elvis) Operators

We now determine types from groups of statements that have a ternary operator.

We return a reduced type from the arguments of the "then" and "else" components of the ternary operator. If the ternary operator is incomplete, we return "any".

While we were doing this we added a new syntax validator to make sure ternary operators were complete, which was missing.

## Re-organized Type Code

The type code has been simplified and re-organized with comments updated

## IDL Debug Mode Stability

It has been fixed! We were able to run 5000 commands without error after fixing a string indexing bug that prevented it from working as expected. We were accidentally trimming parts of the IDL prompt that came back which broke our regular expressions checking for it to return.

## Updated Tests and Test Running

There's a persisting issue with jest that, when you run tests in parallel, it fails on Windows. It is intermittent and annoying. It also uses an INSANE amount of RAM when running this way (I was up to 20 GB).

So the fix is to use "--runInBand" which runs the tests one at a time, which is much slower, but should always work. It also reduces CPU usage which is quite insane as well, especially on computers that don't perform as well.

## Dependency Update

It has been a while and there were some re-named packages that we needed to migrate. Still a few we can't use, because someone decided that there is a difference between CommonJS and ESM and you can't use both (or maybe you can, but there are more important things to investigate).

## Keywords: Types and Validation

In our type code (part of post-processing trees), ww now have several additional cases we handle:

1. We populate variable types for non-input keywords on the first occurrence of a variable

2. For every keyword we encounter, we check to make sure it is a known keyword. We attempt to get the global routine definition and, if we find one, we validate the keyword is correct. We ignore this check if there is an "\_extra" or "\_ref_extra" keyword definition present.

## AutoFix: Compile opt

If your routine definition is missing a compile option, we now add them automatically on save! This works for procedures, functions, and special logic for main level programs.

Part of this activity was adding in helper routines to make this easier in the future and adding a framework for auto-fixing using the same patterns for syntax validators.

We also delineated between tests for assembler (which disables auto-fixing) and new tests only for auto-fixing.

The difference is needed because the tests for the assembler have a secondary check that makes sure parsing the formatted code yields the same tokens (apart from line continuations).

## Fully-Documenting Types for Routines

We now have some routines that we are in the process of documenting and will be taking usage stats from IDL's lib folder and docs website statistics for which routines need preferential type definitions.

## Auto-fixers for Return Procedure

For problems we detect, auto-fix them! i.e. too many args, can't have args, or not present in functions.

## Snippet Re-work

We found this cool blog/article about how snippets work:

https://mercedesbernard.com/blog/ode-to-snippets

So we updated most of them to have default (i.e. placeholder) text using the base name of the file, for example.

Snippets are located in: `extension/language/snippets`

## Type Display Names

Our core type library now exports a constant that you can add custom display names to for any types (i.e. structures).

Any time that we track global tokens, we update this constant with new values that get used when we parse, and serialize, types.

Serialization happens when we generate hover help and run AutoDoc which gives us an all-encompassing solution even if we don't use auto-doc.

Every time that we create a new index, this lookup gets reset.
