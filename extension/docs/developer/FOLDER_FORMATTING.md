# Folder Formatting

This functionality is not documented, but you can create an idl.json file with formatting specified at a folder-level.

That way you could have two directories with slightly different styling applied.

This will be re-documented in a future release, but we want to start simple for the next release.

## High Level Description

- NEW formatter for IDL code with a configuration file called "idl.json" which has auto-complete similar to ENVI and IDL task files, complete with basic documentation for the different controls/options that you can specify.

  - This formatter allows you to control formatting for nearly every aspect of IDL code. The formatter follows decision styles of the popular formatter prettier and offers minimal configuration.

  - All routines, not method calls, can be formatted to match the style of our documentation or the case of user-defined routines from PRO code.

  - The formatter also creates, if you opt in, documentation for you using the IDL Doc format for each and every routine.

  - Docs formatting regenerates on save and automatically adds new keywords/arguments for you

  - Docs formatting makes sure sections are all aligned consistently and make it easier to write docs and not need to apply manual formatting

  - Variables match the case of the first instance of the variable
