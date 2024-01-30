# Changes

## Threading

Worker threads have now been implemented and all functionality should use threads.

## Developer Docs

Did a quick glance at developer docs and made sure all folders at least have a readme with something in it.

## AutoComplete

Fixed a bug where AutoComplete was not tracking user routines which it now does.

Additionally, when we remove a file, we have a routine that can remove them from AutoComplete, but we don't have it enabled. We need to think through duplicates so that we don't accidentally remove it completely.

## Preferences

Condensed preferences as objects for a more concise appearance and less busy preference setting. This also introduces an annoying bug with the VSCode API where, even if we have an object with our preferences (i.e. from nested path like "parent.child"), you now need to set ALL values when updating a single one. Otherwise you nuke all the user information.

As part of this, if you change the developer settings (which needs a restart) we ask if you want to reload the window for changes to take effect. We could extend this to IDL's search path as well.

## Debugging

Debugging has been completely fixed! Apart from pause not working. There were some lingering problems with the step actions not working after the first. The root cause was order of events. Basically, we have to respond to our requests for continuing **before** we actually do the continuing. If we respond after we do the continuing, there's a weird race condition that we have.

We even catch and report syntax errors from compiling/running code.

## AutoComplete

Resolved an issue where we had duplicate auto-completion items reported. This is from a change to how we loaded routines from IDL and tracked the display names.

This had a cascading effect of a few things:

1. Simplifying the entire auto complete code base and have one source of display names instead of "internal" and "user"

2. Because we have one source of routine display names, we updated the formatting options to only have "routines" instead of "userRoutines" and "internalRoutines"

3. Formatting code was also simplified with one setting and one source for routines

## AutoComplete Pt 2

Use preferences for properties, keywords, and system variables to alter the display names and inserted text.

## Docs

For keywords that we add/inherit during docs parsing, we now update the hover help before writing it out to include everything. This makes auto-complete and hover help match our true state.

We found out that we were saving an extra hash of our docs information which we didn't need and has now been excluded which will reduce memory usage and extension size a bit.

## Formatting

Following prettier, we added a "snap" algorithm that will force branch children to start on the line after our branch starts and end at the line before a branch ends.

That means, for example with functions, the end of the function will always be the line after "return".

## Include

Tweaked the logic for include files to fix a few outstanding items and wrap up missing functionality.

1. Variables from include should carry through types as we now do post-processing on include files after we parse them.

2. Variables from include files now properly have "is defined" flags added.

3. Variables from include files will, when ctrl + clicked to go to their definition, will go to the source of the variable in the include file. out tests don't support testing this right now.

4. Go-to-definition will go to include files

5. Auto-complete works with include and is really cool looking! It shows the IDL file icon (if enabled) and looks nice.

6. When we process an include statement, if our included file is the same as the one we process, then return so we don't have infinite loops.

## Snippets

To stick with more modern snippet experiences, all snippets should be updated with placeholders for values so the inserted code will be valid.

## New Type: TypeOfArg

When working with the docs, we have a few cases where our return type is based on the input argument (i.e. reform).

For this, we added a new type that is called `TypeOfArg` which accepts the zero-based argument as an index and uses that as a return type.

> This is meant to be used for internal developers at this point in time. It is an advanced type that only applies to function return types.

For example: a function with `TypeOfArg<0>` will return the same data type as the first argument. Here's a few special cases:

- If we can't parse the index, we return `any`

- If there are no arguments, we return `any`

- If the argument index exceeds the number of arguments that were passed in, we return `any`

- We do not validate that the number of arguments matches the number you are supposed to specify

Here is a code snippet showing the syntax and expected types for a few cases:

```idl
;+
; :Returns: TypeOfArg<0>
;
; :Arguments:
;   a: bidirectional, required, any
;     Placeholder docs for argument, keyword, or property
;
;-
function test, a
  compile_opt idl2

  return, 1
end

; main level program
compile_opt idl2

; string
string = test('string')

; any
any = test()

; number
float = test(1.0)

; array
array = test([1, 2, 3])
end
```

## Tidied Up Tokenizer

We had some erroneous properties and patterns that don't match textmate parsing, so we spent a tiny bit of time cleaning them up.

All tokens have a much more concise approach where, if they don't have an `end` specified, then they are basic tokens and you no longer have to explicitly state that a token is basic. This also removes the need to have the `basic` property and the `end` property is optional (was required before and present when it didn't make sense).

We still need to make it type-generic and separate the tokens from the tokenizer so we can have more thorough type parsing with validation.

## Support Repository

Repurposed support repository with our old fork. I removed the "fork" and nuked the history/source code. It is meant for issues and discussions.

https://github.com/interactive-data-language/vscode-idl
