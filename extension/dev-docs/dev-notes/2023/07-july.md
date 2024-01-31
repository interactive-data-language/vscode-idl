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

## Performance

We worked on improving the performance of parsing when you have a lot of files and have opted-out of the full parse preference.

Here's before and after showing the performance differences and parse rates. This is shown in the IDL log on startup so you can view as well if you want:

```typescript
const before = {
  lines: 2252881,
  app_platform: 'win32',
  app_arch: 'x64',
  app_cpus: 20,
  app_ram: 32,
  app_ram_used: 2.5,
  num_workers: 6,
  parse_time: 13.49,
  parse_rate: 167015,
  num_pro: 7816,
  num_save: 830,
  num_idl_task: 15,
  num_envi_task: 0,
  num_idl_json: 0,
};

const after = {
  lines: 2252881,
  app_platform: 'win32',
  app_arch: 'x64',
  app_cpus: 20,
  app_ram: 32,
  app_ram_used: 1.75,
  num_workers: 6,
  parse_time: 7.86,
  parse_rate: 286567,
  num_pro: 7816,
  num_save: 830,
  num_idl_task: 15,
  num_envi_task: 0,
  num_idl_json: 0,
};
```

## Performance Testing

We have a new app to help track performance in a single-threaded (the slowest) environment. It prints out the time to parse the lib folder, memory used, lines of code, and rate that we parse.

See `apps/performance/README.md` for more details

## Memory Usage

At the cost of performance, we have reduce memory usage dramatically when combined with garbage collection. Before:

```
idl-client info Performance test
   {
    "method": "index-single",
    "compression": false,
    "multiplier": 4,
    "full": true,
    "postProcess": true,
    "changeDetection": false
  }
Reading files [=========================] 0.0s 1563/1563 wavelet/source/wv_tool_denoise.pro
Extracting tokens via "index-single" [=========================] 0.0s 6252/6252 undefined

idl-client info Performance
   { time_ms: 74696, memory_gb: 7, lines: 1802304, rate: 24128 }
```

After:

```
idl-client info Performance test
   {
    "method": "index-single",
    "compression": true,
    "multiplier": 4,
    "full": true,
    "postProcess": true,
    "changeDetection": false
  }
Reading files [=========================] 0.0s 1563/1563 wavelet/source/wv_tool_denoise.pro
Extracting tokens via "index-single" [=========================] 0.0s 6252/6252 undefined

idl-client info Performance
   { time_ms: 83650, memory_gb: 3.75, lines: 1802304, rate: 21545 }
```

## Improved Language Server Startup

Fixed some problematic file discovery logic that searched the same path 5 times. It was replaced with a single glob pattern that looked for all files instead and, for one users, make the file discovery process take 7 seconds instead of 27.

No idea what was taking so long for it to start, but it was the only potential culprit based on performance logs.

Along those lines, we now have much better output on startup to track what parts of startup take the most time:

```typescript
const before = {
  lines: 2252881,
  app_platform: 'win32',
  app_arch: 'x64',
  app_cpus: 20,
  app_ram: 32,
  app_ram_used: 2.5,
  num_workers: 6,
  parse_time: 13.49,
  parse_rate: 167015,
  num_pro: 7816,
  num_save: 830,
  num_idl_task: 15,
  num_envi_task: 0,
  num_idl_json: 0,
};

const after = {
  lines: 2243829,
  app_platform: 'darwin',
  app_arch: 'x64',
  app_cpus: 16,
  app_ram: 16,
  app_ram_used: 1.75,
  num_workers: 6,
  parse_time: 5.0200000000000005,
  parse_rate: 446711,
  num_pro: 7732,
  num_save: 735,
  num_idl_task: 15,
  num_envi_task: 0,
  num_idl_json: 0,
  num_notebook: 0,
  time_total_ms: 5583,
  time_search_ms: 102,
  time_config_ms: 0,
  time_task_ms: 267,
  time_save_ms: 0,
  time_notebook_ms: 0,
  time_pro_ms: 5023,
};
```

## Test Stability

We had some issues with test stability where tests would pass and then they would fail sometimes.

We added a pause, and constant, that forces a break between running tests. I would posit that it has to do with data being synced between the VSCode client and the test runner and/or extension host.

Either way, with these changes, we have tests that don't have intermittent failures anymore.

## Notebook Stability

Along those same lines, when we processed a notebook cell (or ran a notebook), we would end up with inconsistent behaviors where it would run 4/5 times and occasionally fail.

Now, after each cell executes, we have a 100 ms pause. After adding this is, our notebook cell execution tests all work as expected!
