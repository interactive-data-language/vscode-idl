# Feature List

This page lists the many features as a part of this extension!

## Features

- IDL Notebooks for a new, modern, and ad-hoc way to develop IDL code! Check out the examples to learn about how they work (accessible through the sidebar of the extension).

- Before compiling any code, more than 100 syntax errors/problems/hints are detected and reported to users.

- Syntax errors you encounter while writing code offer information/details on why they are problems to help you learn the in's and out's of IDL better.

- Syntax-based highlighting to make it easy to visually catch errors. This new-and-improved highlighting experience also accentuates keywords and operators like never before. Actual colors will depend on your theme and there is a guide for how you can customize token colors/appearances for IDL.

- Ability to format your code on save and have control over key formatting preferences. The default matches what we think of as a modern approach and styling to IDL code that will be welcoming to new users.

- AutoDoc which, if enabled, automatically adds/updates documentation for user routines as you save your files. Works for routines and structure definitions found within "\_\_define" named procedures

- **Debugging!** A preview release of debugging has been implemented and is stable enough for use. **Note**: this is going to be re-worked over the course of the next 3-6 months

- Hover help for user-defined variables, functions, procedures, arguments, and keywords.

- Integrated hover help for core IDL and ENVI routines, their keywords, and structure properties.

- Integrated support for ENVI and IDL task files in workspaces and on IDL's path, including auto complete and hover help

- Go-to definition for functions, procedures, and methods from user defined routines

- Extensive auto-complete built on the IDL and ENVI documentation. Auto-complete is also automatic (you don't have to press Ctrl + Space in order to trigger it).

- Provides a high-level outline of your code with global constructs (i.e. routines and main level programs)

- Profiling. Get basic profiling information for your routines and access via buttons or commands.

- Custom IDL color themes. If you are feeling like you miss the IDL Workbench, then the "Retro IDL" theme is for you! Two more dark themes are included and are "Novus IDL" and "Neon IDL."

- Finds `TODO` statements just like the workbench

- Support for VSCode's auto-comment (Ctrl+/ or command+/)

- Code snippets for common code blocks

- Colorization and schema validation of ENVI and IDL task files.

- Commands (Ctrl+shift+p) for terminal and debug sessions:

  - Opening an IDL session

  - Compiling

  - Running PRO files (run button in the workbench)

  - Executing PRO files as batch files (single line statements)

  - Execution controls (stop, in, over, out) for IDL in a terminal

  - Plus some others!

- Support for internationalization

  - Submit a bug/feature for adding languages. Hopefully they are for a language that you speak, so you could also help with the translation :)

## VSCode Commands

The standard way to execute actions within VSCode is to use commands.

If you want to see our command API, you can:

1. Open the command palette in VSCode

2. Search for `IDL:`

3. See all of our commands! They are prefixed with `IDL` to make them easy to use

::: tip
Most commands will work from the command palette, but some require additional input to function. If you see a command that you want to be able to run, let us know on GitHub and we can try to figure something out!
:::
