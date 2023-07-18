# July

The month that we will release the extension! All efforts should be smaller and help improve extension user experience.

## Track Literal Types

We now track types of literal values (i.e. `a = 42` or `a = 'foo'`) and show them to you when you hover over the variables.

## AutoComplete Re-re-work

Auto complete now performs better! We tweaked the automated nature of auto complete to include edge case characters (such as "@" and "!") that should trigger auto-complete on.

This list can be found in `libs/vscode/server/src/lib/initialize-server.ts` under "triggerCharacters".

### New Auto Completes

We also added new auto-complete scenarios: system variables and executive commands!

It's basic so far, and we probably need to sort out hover help for executive commands at some point, but that can wait.

We also accidentally fixed a bug where variables were being sent when they shouldn't be.

### Auto Complete Bug Fix

A notable bug was squashed with auto complete. We were not clearing out items from the auto-complete lookup when we would re-index a file (i.e. delete what was there and replace with the latest). This means that, if you types a function definition called "myFunc", you could end up with function auto completes for "m", "my", "myF", etc. depending on how slow you typed it.

When we remove tokens from our global lookup, we now also clean up the auto-complete lookup **if** there is only one definition for it. For example: if you have two routines with the same name, and remove one, we keep the old auto-complete.

## Hover Help Perfection

Ok, well maybe not perfection, but a **lot** better user experience than it was before. We found out that our hover help immediately disappeared when you would move the cursor after hovering over a variable or routine.

When we inspected VSCode and TypeScript, we found out that this is not the case for them! It turns out that, if you return a `Range` with hover help, then it behaves the same. That way you can get hover help for a long routine and it doesn't disappear or need to be re-retrieved every time you move the cursor.

## File Renames

Important file renames for being able to easily find the source of something:

- Any styling for assembling is now called "style-" and then the thing we style (i.e. "style-variable")

- Any files for getting types from something are called "type-from" and then the thing we get types from (i.e. "type-from-variable")

## Static Variable for Class References

We revamped the logic for detecting if a variable is truly a variable or a reference to a static variable method and added tests for this.

This is the file where it lives:

`libs/parsing/index/src/lib/post-process/populate-type/from/helpers/evaluate-static-reference.ts`

This also has a new property for variables called `isStaticClass` so that we can effectively filter/find variables that match these patterns.

## Formatting Static Class References

Because we have variables as class names, if your style flag for variables is set to "match" then we format the static variable to have the same display name as the class' display name.

For example "data = envi.data" becomes "data = ENVI.data" because the display name for the ENVI structure is "ENVI" (to match our styling with IDL)

## Tracking Variable Locations

Each variable that we detect (local from parsed) now tracks the positions of where we detect it. This opens the door for future patterns to potentially rename routines, keywords, and variables across your code base.

## Semantic Tokens

We added a first pass at semantic token highlighting and a standalone lib for it (`parsing/semantic-tokens`). Within is the framework for semantic tokens and one that has been implemented: static class references!

We now highlight (because we have information about if a variable is a static class reference from the work above) classes with slightly different highlighting. They appear as our special color, but are not bolded like system variables or types.

The goal here was to get the pieces in place to figure out the pattern, and how it worked, so that we could extend in the future!

This is only enabled for PRO code and the root implementation can be found in `libs/vscode/server/src/lib/user-interaction/events/on-semantic-highlighting.ts` and is tied into IDLIndex and our worker threads.

### Config Change

We also added a new default configuration for the language which, for IDL code, enables semantic highlighting.

## Test Re-work

We decided to clean up our tests and have a centralized group of libraries dedicated to holding the tests that are automatically generated.

The automated tests now all live in `libs/tests` and are separated by capability.

Because they are separated by capability, when we run tests, we have a more narrow set of tests that are executed. It also adds more libraries that get tested, meaning that we have smaller groups of tests that we can run in parallel.

This means the overall test time is down to ~2 minutes from 5!! This is because we had about 10 sets of automated tests that all lived in the parser/index folder and, if one test file changed, all would be run (and they can only run one file at a time) so it was very slow.

With this change we will hopefully have a much better developer user experience for creating tests and faster test times overall.

## Usage Metrics

One of the last, big items we worked in for the extension was incorporating usage metrics for the extension.

The usage metrics are documented in `extension/docs/general/USAGE_METRICS.md` and are managed by Google Analytics. The core concept is to understand language server performance (time to start up, approximate number of files, RAM used, total RAM, etc) and what features of the extension are being used (i.e. buttons to start IDL or open docs or manually format code).

No user-specific data is collected and we use the VSCode overall preference (and pattern) for reporting usage metrics. If you disable usage metrics for VSCode, you will also turn them off for the IDL extension for VSCode.

## Problem Reporting

While waiting for export approval fo release, we poked around at some of the ways that we report problems. We changed our pattern to follow what VSCode does so that the problems codes are formatted the same as other languages in the VSCode UI.

This means we no longer report `idl("alias")` before the text of the problem code.

Instead we specify the name of the language and the code description as part of the `Diagnostic` that gets sent back. This gives us a nice visual appearance!

We also added a period to the end of the description for diagnostics to match the TypeScript pattern.

We also will add a URL to a local markdown file with a description of the problem and, if applicable, how to resolve it.

## Document Cache

This will likely need to be improved in the future, but we added a filter to most of our events from VSCode that checks the code to make sure it has _actually_ changed.

For whatever reason, go-to-definition triggers open, change, and close events for a file. These bombarding events broke the language server and its a little concerning why all those events are fired when nothing has changed.

## Memory Issues

There were a number of issues resolved with regards to memory usage for the extension. Here's a quick summary:

1. When launching as node.js, the garbage collection (and memory limit flags) were not being passed in correctly

2. Worse, we weren't trying to detect node.js correctly on non-Windows platforms. This was an oversight in development where it was just played with on Windows (where we have large workspaces).

3. Added a cache class for storing/restoring content from memory. This stringifies key elements of our parsed code and dramatically reduces memory usage. For large workspaces, we are about 2x faster to parse as well (probably related to garbage collection). The odd thing is, as a part of this, we are copying objects that we store which is interesting in that is speeds up processing.

One of the next features, post-notebooks, is probably going to be performance. We need to figure out how to more efficiently parse large workspaces so that, the next time we load them or encounter a file, we can start in a matter of seconds.

Another item we can add to our to-do is including a similar style cache for global tokens to store them as strings and potentially compress them until we need to access them, but that adds a fair bit of complexity.

## Notebooks

We started work on notebooks this month! And work is progressing quite well.

See the NOTEBOOKS.md file in the developer docs folder for more details on how it works.
