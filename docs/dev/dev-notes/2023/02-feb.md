# Changes

### Misc

Fixed a problem where the docs from auto-doc would use the parsed display name for keywords rather than the display name that should have been used from code styling.

### Logging

Fixed a critical bug with logging where we weren't actually reporting errors up the chain.

Fixed another bug that wasn't logging a single thing when not in developer mode, which was a bit embarrassing :)

Added statements to capture all console log statements from the extension client, the language server, and the worker thread for parsing and centralized all the logs to the extension client. Each console log has a placeholder for the log name to make it easier to track down where errors are actually coming from.

### Initializing Config Files

Added several new pieces of functionality for helping automate config file generation:

1. Added a new command to allow you to pick from open workspaces that don't have an "idl.json" file and create one for it

2. Added language server functionality that will check each folder automatically and prompt the user to create an "idl.json" file if one is not found.

   This change is also far-reaching as it required a new preference to track when we offer the "Don't Ask Again" item with our dialogs so that users can disable the messages on a folder-by-folder basis

3. Add the command to our sidebar view so that users can click a button to initialize a file. This is a sto-gap for people who don't use the command palette and who might have said "Don't Ask Again" for their folders they frequently use.

### Internal Routine Lookup

There were a decent number of internal routines that were completely missing from the docs that we were parsing.

The parsing process went through an overhaul to try and detect when we had object methods in external files (i.e. some graphics routines only references methods like "save" and pointed to the source file). We needed to add some logic to parse an associate the parsed methods with our parent class. This was present with all of our function graphics and maybe 15-20 other classes.

There were also some other bugs/items resolved to make sure we were capturing as much information as possible.

This includes automatically trying to guess the type of keywords and properties from the docs and adding in a framework to persist this information and make it easy to manually enter/update/verify.

The manual files are not currently being saved to disk right now as the automation will likely be updated. It is a last step to add in.

### Method Formatting

Matching typescript syntax, for internal routines, we are using camel case for methods and, if they start with ENVI or IDL, pascal case for routines and classes.

For example:

```idl
a = PascalCaseClass()
a.camelCaseMethod
```

This was also extended to apply to internal docs, but it is inconsistent as we don't know the return types for everything and can't fill in the detail.

### Type Detection from Functions

Basic type detection from static code for the return value from functions. You can find the logic for this here:

libs/parsing/index/src/lib/post-process/populate-type/from/function/from-function.ts

The behavior is as follows:

1. For ENVITask, IDLTask, or obj_new, we attempt to parse the first argument and, if it is a string (single, double quote, and template literal supported) then we use that for the return type

> Need to handle string literals as well with backticks.

2. If we don't have one of the functions above, we use the function name as the class name

3. We check for a matching global class (i.e. structure definition) that indicates we have the special IDL syntax for creating object classes

> This is probably something to think through, at least with ENVI and IDL tasks, because we don't want to use "any" if we don't have a matching task. It also means we need to parse task files and add/update our global lookup for classes with what comes out of a task file, which will add a fair amount of complexity, but would be a great addition for ENVI developers.

4. Check if we have a matching global function and use the data type for our function return

5. Default to the "any" data type

### Type Detection To Dos

A list of things that we have as gaps in type detection:

1. Pattern to track the global tokens we use (i.e. user functions) that, when the source changes, we re-evaluate types for

2. From properties like "a = b.prop"

3. From other variables like "a = b"

4. From arguments like "!null = myFunc(a,b)"

5. From keywords like "mypro, a, KW_OUT = myval"

> Think through how we want to handle validation and error reporting here. We will be in the right location to report problems that we find with incompatible types as well. This would include properties that don't exist.

### Type Detection from Variables and System Variables

Are now supported and, for system variables, we just check if we have a global structure type matching the name (i.e. `!x`)

### AutoComplete Fix and Revamp

Overhaul logic for auto-complete to be smart about when to, or not to, add in parentheses for things like function calls.

It has also been updated to be smart about when we should send variable information (i.e. not a direct function call).

Tests were updated to limit the number of responses to 50 so that we don't have massive test files with hundreds-thousands of entries (250kb for all functions for auto-complete)
