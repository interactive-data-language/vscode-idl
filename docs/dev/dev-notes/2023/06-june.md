# June

## Fixed npm start

No more fake changes, it does the right thing now :)

## Landing Page

Revamped the README for a snazzy landing page when someone gets to the extension.

This will have to be updated when the repo is live since none of the links work when not in markdown preview mode.

## Task Support

While waiting on compliance/legal, added a first pass at support for ENVI and IDL task files! This means we:

1. Search for task files on IDL's path and workspace

2. Parse them using our schemas

3. Create matching global tokens for auto-complete and tracking properties

4. Minimal feedback for users regarding duplicates or any other errors in the task files themselves.

Along the lines of the last bullet, as-is, the processing is very silent and does not alert the user if there are errors (i.e. in schema, how we are handling events, things like that). This is just a first pass and will probably stay at this level of functionality until we have a more rigorous ability to parse and report problems for task files.

This also means that we don't have any tests just yet (not to say we couldn't add them), but we have some of the most basic functionality that we could have.

Additionally, we do not use the worker threads to process the task files. Assuming we have very few, and we can just use the JSON schema to validate, it should be lightning fast, even if you have a lot of task files.

## ENVI Task Data Types

Using the code above, we added some additional logic that will:

1. Find ENVI Tasks from the docs
2. Check for a matching ENVI Task in the ENVI installation
3. Parse the task
4. Set the true data type per the task file

## IDL Index Re-Work

One of the more confusing parts of the IDL Index was that there were multiple code paths for how to index different kinds of files.

Given that we added a third type of file (i.e. tasks), it was important to spend some time cleaning up the code and adding the type-of-file detection logic into one place.

This triggered a few things, where a lot of methods for the IDL Index class are now private (so make it more clear what to use externally when interacting with the class).

Additionally, we removed the code paths for "get parsed pro file" which removed a lot of duplicate logic for processing PRO files with source code or from a source file.

These changes were implemented in all of our "on-" event files for the language server which also cleaned up the logic in there quite a bit which was the goal.

Lastly, when performing our cleanup, we made sure that all events use the Set class to make sure we have unique file events and that we don't duplicate processing.

## Task Formatting

Basic formatting for task files with the ability to control upper/lower case for "keyword", "name", "direction", and "required" tags for parameters.

All key/value pairs, as long as they are strings, also have all white space trimmed from them.

We also use a very basic JSON formatter that makes the task file look nice.

To access task formatting, you have to use the button in the IDL sidebar or the format file command. Unfortunately, at this point in time, format on save is not an option as the files are technically "JSON" in nature and we don't want to use IDL for formatting all JSON files.

Considering how infrequently people use task files, this is probably OK!

## Task Generation

New button to make ENVI or IDL tasks directly from within VSCode!

Needs tests, but basics all check out.

## Slight Type Re-work

In type detection, we now copy types when we fetch them (unless they are stored in our cache). The reasoning for this is that we are tracking actual values of types now so, if we want to change/manipulate them, we want to do that in isolation and not everywhere.

## Track Literal Types

Any variable defined using a literal type (string, number) now has the initial value saved.

This gives us a more rich hover help experience and, once we track types by line, should work pretty well.

These literal types are also used for creating hover help for variables and properties. It's not perfect, but it is better than we had before!

## ENVI and IDL Task Types

We completely re-worked types for tasks and all task types now expect/create a type argument with the name of the task.

This makes them much easier to read as "ENVITask<mytesttask>" instead of "ENVImytesttaskTask" which we had before.

As part of this re-work, and for tasks, the display name and type name do not match. The official internal name for the type is the class that we have a global for which is "envitasknametask". Because we have a reference to the original class, we also update the display name for the type on save/format just like we do for other types.

Although this adds some complexity, it makes for a much better user experience.

## Task Auto Complete

We updated the way that we do auto-complete for ENVI and IDL task functions. Instead of using the class name, we now insert text of the form `ENVITask('TaskName')` and we show that same text as the label for auto complete.

This should dramatically improve the readability of the task auto complete.

Additionally, the quotes used around the name of the task from from our formatting config and will respect single or double quotes.

Part of this also added in an update to our test generation framework so we can add a filter for what completion labels should start with so that we can be laser-focused for testing behavior as specific as ENVI and IDL tasks.
