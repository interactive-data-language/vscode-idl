# Change Log

All notable changes to the "idl" extension will be documented in this file.

For much more detail on incremental work for large features, see our [developer notes](./extension/docs/developer/dev-notes/README.md).

## Preview Features

This section of the CHANGELOG documents features that have been added to the extension, but are still in an experimental phase. Feel free to try them out and provide feedback via discussions or issues on our GitHub page.

Code style revamp! We reworked how routines, routine methods, properties, and structure names get formatted. This includes:

- Support for camel case ("camelCase") and pascal case ("PascalCase") styling. Mileage may vary here, based on the routine names, so please let us know if this doesn't look quite right or do what you expect. Some routines that start with "IDL" or "ENVI" might surprise you with the case conversion.

- New style setting called "routineMethods" so that you can indicate the styling for methods apart from normal functions or procedures

- New style setting called "structureNames" so that you can have structure names have consistent formatting.

- We also now format the structure names in inheritance statements.

- We also use structure formatting preferences when auto-completing structure names

- Routine formatting now gives you the benefit-of-the-doubt when formatting routines and routine methods. In the past, if we encountered an unknown routine, we would not change the appearance. Now, even if we don't know the class method or routine, we apply styling. Milage may vary here based on the style you use when we can't get the source information.

- New defaults:

  - Properties: camelCase

  - Routines: match definition

  - Routine methods: camelCase

  - Structure names: PascalCase

- When generating ENVI and IDL tasks, using our new case libraries, we attempt to make a pretty display name from parameter names. For example converting the keyword "my_keyword" to "My Keyword". This applied to task and parameter display names.

## 4.2.0 December 2023

Added the ability to convert a notebook to a PDF! This requires an additional extension called ":"Markdown PDF", which you will be prompted to install. This includes:

- A new sidebar entry for PDF generation and a button in the top-right of the notebook to generate a PDF

- When you click either, as long as your notebook is saved to disk, it will create Markdown, open it, and start the PDF generation process

- Once finished, it closes the Markdown file

- The Markdown and PDF file use the same base name as your notebook. Meaning if your notebook is called "My-notebook.idlnb" you will have a "My-notebook.md" and "My-notebook.pdf" file generated in the same folder

- You do need to save your notebook to disk so we have a path to write the Markdown and PDF files

Updated the ENVI Notebook maps to no longer show "No data available" images and, instead, zoom into the highest zoom level available for basemaps

Fixed an issue where we didn't have the right paths for IDL 9.0 on Mac and included a path for ARM64 for Apple Silicon

Re-worked the way that data is moved around between the IDL Language Server and worker threads to be more efficient. Now, no representations of PRO code should be transferred between processed which will provide lower CPU usage and RAM spikes from sharing our syntax tree.

This change ensures that work that happens will occur next to the data that is needed. This should improve:

- Hover help

- Auto-complete

- Go-to definition

- Formatting PRO code

- Formatting IDL and ENVI notebooks

With this change, and if you have very large files, you should notice a dramatic difference performance. For example, the file "slicer3.pro" in the IDL lib folder used to take 4-5 seconds for hover help to appear. Now it takes ~30 milliseconds!

Considering this is a large change, please let us know if there are any noticeable differences that our tests have not captured.

While re-working our data transfer pipeline, we also made some fixes and improvements to auto-complete. There were some test gaps which have now been resolved which will:

- Fixed a problem where auto-complete for procedure methods would add properties when inside the procedure method call

- Fixed a problem where auto-complete for procedure methods would not add variables

- Fixed a problem where auto-complete for procedure methods would not add keywords

- Fixed a problem where auto-complete for methods would not functions

- Changed the logic for when we send properties, procedure methods, and function methods and made it context aware to only send things like procedure methods where they are allowed

Resolve an issue where a circular error would be reported when creating JSON

## 4.1.2 December 2023

Change the way we extract comments to reduce memory and speed up parsing by about 10%

## 4.1.1 December 2023

Added a new preference for notebooks called "Quiet Mode" that allows you to control the IDL preference for `!quiet` when executing notebook cells.

When using ".edit" in the debug console, added a message that let's you know that a matching file was not found.

## 4.1.0 November 2023

Fixed a bug with the debugger that would fail to get information about your IDL session.

Add auto-complete within compile_opt statements! This now shows you all the compile options that are available and is smart enough to filter out compile opts that have already been specified.

Add a new option to disable reporting problems with user docs. This setting can be found under "Problem Reporting => Report Docs Problems".

Fixed an issue that incorrectly handled when a system had an odd number of CPUs and we could not create the right number of worker threads causing the language server to not start up

Added the ability to parse legacy IDL Doc style tags that use the `@tag` style approach. Not all of the same docs functionality and validation works, but the core information is brought into the language server.

- If you are using AutoDoc when formatting code, any of these legacy IDL Doc docs will automatically be migrated to the RST (i.e. new) flavor of IDL Doc. This way, if you want, you have an option to migrate to the latest and greatest doc style automatically.

- Also updated syntax highlighting to account for these docs tags

## 4.0.0 November 2023

The official release of IDL Notebooks! This is a first pass at adding notebook support for IDL (which is independent from Jupyter). We are hoping to have early adopters try it out and provide feedback on how notebooks behave. Read below to learn more or find an example IDL and ENVI Notebook directly within VSCode in the IDL sidebar.

Here are some of the features that notebooks bring:

- Notebook files should end with the extension ".idlnb" which are managed and rendered by the IDL extension.

  - Notebooks support highlighting, problem reporting, hover help, auto-complete, go-to-definition, formatting, and semantic token highlighting.

    > Pro tip: See the FORMATTING.md doc for information regarding how to format notebooks on save.

  - Basic notebook functionality for saving (including outputs and images) and restoring all works as expected

  - Notebooks embed images. If you use function or object graphics, all windows will be embedded.

    - At this time, there may be some graphics that shouldn't be grabbed (like when you run ENVI processing with the ENVI UI open)

  - Notebooks do not embed widgets.

  - Notebooks only support Markdown and IDL cell types

- When running cells, notebooks automatically start an IDL process. Notebooks provide two custom buttons for managing IDL: Reset and Stop.

  - Reset will stop and restart IDL so that it is fresh (this way you can interrupt cell execution)

  - Stop will stop the IDL process and interrupt cell execution. A new IDL session won't be launched until you run a new cell.

- Ability to run cells:

  - Cells are executed as-is and don't support debugging or interactive processes.

  - See the "Hello World" notebook for details on how cell execution works and how you can write code

  - After each cell is executed we issue a `retall` command to make sure that we are at the top-level and not stopped in a weird state

Updated the IDL and ENVI icons throughout the extension and on our github pages. This is the same icon that will be used as part of the next official release of ENVI and IDL.

We now use colored icons for file icons and added some new file associations for our ENVI within the editor. If you have a theme that doesn't look great with our icon colors, let us know!

With the new icons, updated our custom icon theme to include the new ENVI logo for key ENVI file extensions.

Added the ability to convert your IDL notebooks to PRO code! This exciting features uses intimate knowledge of IDL to break down the code in your cells and put it back together as a single PRO file.

- Any routines and non-main level program code is put together first and follows the order of the cells. Then, any main-level programs within cells or single lines of code are added as one, large main level program at the end.

- Milage may vary based on how you wrote your notebook, but it is very easy to get out your routine definitions

- Use GitHub to let us know if this should behave differently!

Expanded sidebar for notebooks with buttons for:

- Creating a new notebook

- Formatting the IDL Code in your notebook cells (shortcut for VSCode native command)

- Ability to open an example IDL Notebook

- Ability to open example ENVI Notebook

- Converting notebooks to PRO code

There's also a command added that will reset your example notebooks to what we had originally. it is called "IDL: Reset IDL and ENVI Example Notebooks'.

When automatically opening ENVI files, the text displayed adds a note about how you can disable the behavior by looking at the extension documentation.

Optimize the generation of the code outline and semantic tokens (static class references) to calculate both at the same time we are parsing a file or cell of code. This reduces extra CPU usage from retrieving complex information from our cache.

When notebooks start, we now perform an extra check to make sure we have the routines needed to function correctly. This is mainly for developers and edge-cases where you weren't provided any feedback on the startup process and wouldn't know there was a problem.

Resolved an issue where you couldn't view the output from a notebook cell in VSCode. We provided a default VSCode configuration which fixes this problem and added a new doc to the extension to capture known issues and how to solve them.

Fixed an issue where statements being sent to IDL were not executing correctly for implied print

When generating ENVI and IDL tasks, we try to make a nice display name for task and parameter names

Added auto-complete for "inherits" statements in structure definitions

Fixed an issue where we incorrectly identified main level programs in parsed PRO code that were only comments

When we parse documentation for routines, we now accept docs within routine definitions. If you have a comment block immediately following parameters, then that takes priority over comment blocks above.

## 3.2.4 October 2023

Fixed an issue where improper versions of node.js were used for the language server startup. This caused failures in the language server starting which would prevent any of the feature goodness of the language server from being accessible.

Added in a sidebar entry for notebooks

Updated cache logic to fix a potential circular JSON error when adding items to our cache

Renamed "Additional Actions" sidebar to "Quick Access" and updated the icon used

Resolve an edge case when running notebooks where a false-failure would be detected that halts notebook execution.

Fixed an issue when launching IDL on Mac where ENVI crashes because "LANG" is missing from the environment

## 3.2.3 September 2023

Re-work cancellation to handle cases where the worker threads were too busy to get the messages that work needs to be stopped. If you now use a very large file (take "slicer3.pro" from the IDL distribution) events are interrupted as expected.

This also includes a fix where false error messages would show up in the UI for work that was canceled.

Update most dependencies with changes from first re-release of the extension

Fixed a bug where the "strictarrsubs" compile option was missing from the list of valid compile options

Fixed a bug with the code sidebar icon not showing up in light themes

## 3.2.2 September 2023

Major change to the language server and worker threads to implement a cancellation framework. The ability to cancel work happens automatically for PRO files and IDL Notebooks.

This change will address performance issues where, if the code can not be parsed as quickly as you were typing, you would not get auto-complete, outlines, hover-help, semantic tokens, formatting on save, etc.

In these cases it could take 15-30 seconds for the language server to respond while it worked through a backlog of processing that was no longer relevant.

## 3.2.1 August 2023

Notebook key behavior change: If you are running one or more cells, and there is an error from IDL for any cell being executed, all pending cells are cleared and not executed. This makes sure that, if later cells depend on earlier ones, that you don't have cascading failures.

Resolve a problem with the language server where you can get into an infinite loop trying to resolve include statements in IDL when they end up including one another

Add a potential fix for always-increasing loops when doing change detection for parsed files

Fix an issue where, if you have the same folder or sub folder on IDL's path and in an open workspace, then you would get duplicate problems being reported. We now get the unique files from all folders on startup at once to resolve this.

Fixed a bug where notebook cells would sometimes process in the wrong worker thread, causing inconsistencies with things like semantic tokens.

Fixed a bug where semantic tokens (highlighting static class references) was wrong when tokens were built out of order from top down and left to right

Added a new problem code that detects when the IDL include statement creates a circular include pattern

Fixed a bug with semantic tokens in notebooks where the text would be highlighted as a semantic token in cells that don't have any semantic tokens

When you click into the outputs from an IDL notebook that is being rendered by the IDL Extension, a blue outline appears over what you have selected to match VSCode's behavior

Added logic when retrieving outputs from IDL to be more backwards compatible. As it was, you needed at least IDL 8.8.3, but it now supports pre-8.8.3 at your own risk.

## 3.2.0 August 2023

When the language server does not use a full parse, extract structure definitions. Before, this was a logic gap (and made the code faster), but they should be correctly resolved now with minimal performance hits.

- For context, using non-full parse can give a 4x improvement in performance (parse rate with 6 workers goes from 90k lines/second to 425k lines/second).

Change execution path for notebooks so cells are compiled in the same folder that a notebook lives in. This makes it much easier to load datasets that are next to the notebook (for data scientists) and mimics the behavior of PRO code. This means that, if you use "routine_dir()" or "routine_filepath()" from a notebook, it will resolve to the path that you expect.

For images, added a button that allows you to save the graphic to disk. All files saved to disk are in PNG format and come from the embedded images within the notebook file format. However, this makes it easy to generate graphics and export them from notebooks!

Added auto-complete for structure names when there are no properties or only the beginning of a name has been typed

Fixed a bug where task files and idl.json files were being processed as PRO files and reporting crazy errors

Re-worked the notebook file format to be human readable (as JSON). **Do not edit the files by hand as you risk breaking your notebooks**. This new format:

- Is pretty-printed JSON which can easily be read and is easier for git GUI applications to manage

- Has a reduced size when we embed graphics

- Uses a schema for complex output types (i.e. images, animations) with the pipes in place to have custom renderers or applets embedded in notebooks

- Normalizes line endings on save which makes sure notebooks are the same on Windows vs Linux/Mac

- Allows some transparency into the notebook format with what gets stored

- All outputs from IDL are stored as a JSON string. This is to reduce file size and improve parsing speed (future concept is embedding plots/graphs which requires data that pretty-printed JSON would make unreasonably large)

For all notebooks, we add extra catches when attempting to restore notebook outputs saved in the file. This means that we can update the way outputs are stored/processed in the future without breaking notebooks completely. You would just need to re-run cells and regenerate outputs in the format that we expect it to be.

Fix an un handled case for auto-doc with structures where we didn't add spaces after an empty structure definition (even though that is invalid for IDL).

Fixed a bug with notebooks where cells weren't cleaned up properly and you would get fake duplicate routines reported as a problem. Added tests to catch this in the future.

Fixed a bug where docs header regular expressions were being over-zealous and grabbing more than they should.

Fixed some bugs with styles of embedded graphics not appearing quite like they should when the notebooks are small.

Fixed a bug where error resolving completion would show a message about hover help

Fixed a bug where auto-complete would fail when you had fatal syntax errors in code and for/foreach loops

Fixed a bug where auto-complete in notebooks wouldn't get the code from the cell for the right auto-complete user experience

Further increase node.js timeout for edge cases where it wouldn't respond/start fast enough

Changed the formatting behavior for structures when they have line continuations.

- Before:

  ```idl
  !null = $
    {MyStruct, $
    _foo: 5}

  !null = $
    { $
    _foo: 5}
  ```

- After:

  ```idl
  !null = $
    {MyStruct, $
      _foo: 5}

  !null = $
    { $
      _foo: 5}
  ```

## 3.1.4 August 2023

For routine documentation, add button "Open Examples in Notebook" Which opens the routine, the description, and likely code examples as runnable notebook cells

- If there are no code block examples for the routine you are hovered over, no notebook will appear

- By default, the notebook opens to the side. If you have one editor group open, a new one is created to the right.

- If more than one editor group is open, we open to the left or the right of the active editor, depending on which editor is active (this makes sure we don't keep opening new tabs)

Resolved an issue where problems were not being synced when no workspaces were open in VSCode and added tests to verify they are sent.

Normalized language server events to all wait for startup before they process requests from VSCode

Get framework for supporting notebook cells in language server with first pass at same language server methods for PRO files and notebooks

Re-work the ENVI and IDL documentation parse logic to use "Online Docs" instead of the routine name and a link for the web-version of documentation

Use better practices when normalizing code from docs. We now auto-fix problems so that compile-opt idl2 and other best-practices are always present

Fixed a problem when running notebook cells that would cause them to fail executing when the .idl sub-folder we use wasn't present and added tests for it

Fixed a bug and added tests for an issue where non-standard docs blocks would continue to be indented after every save. We now use the intent level of the first non-empty line in docs as where it starts and use that to normalize the indentation.

Fixed auto-complete sending keywords in a few scenarios where it shouldn't and added tests

When checking for node.js, increase timeout from 100 to 250 ms

Resolve an issue with the newly added token cache where all problems were not reported to the user when you changed your path after opening VSCode

## 3.1.3 July 2023

Fix bug where, if you had a function or procedure without a name, parsing would occasionally break and cause a bad state for the language server

Change order of some language server startup events

Indicate we are done parsing before we sync problems with the VSCode UI

Add in some manual cleanup checks for main language server process to reduce memory growth over time

Every 5 minutes, the language server runs garbage collection in an attempt to reduce memory usage and logs approximate memory used in mb to help logging/track over time

Update bundled documentation for ENVI and IDL routines to look nicer and give better visual experience for routines with keywords

Change the way we check for node.js to try and work around a hang on extension start

## 3.1.2 July 2023

Attempt to fix likely hang when detecting node.js to use for the language server

## 3.1.1 July 2023

Fix likely bug with docs parsing without full parse language server setting

Tweak file discovery process to use a single glob pattern and search once instead of 5+ times for each kind of file to try and address performance issues

Add more debug information on language server startup to tell us how long it takes to do each part of workspace indexing, including discovering files

In case some of our messages with worker threads are slowing down overall performance, add some optimizations for message sending to only serialize messages a single time

## 3.1.0 July 2023

Fixed an issue where garbage collection was not turning on and caused out-of-memory errors which led to language server crashes

Added a cache to reduce memory usage for worker threads (large workspaces with 300+ files should use about 50% less RAM). Coincidentally this also improved performance as well.

On startup, a new log statement prints to show the state of garbage collection: `idl-lsp info Garbage collection enabled: true`

Improved the on-enter commands that automatically continue comment blocks as you type within them. They were close, but not quite there are some rules conflicted with one another so they didn't work right.

Fixed a major performance issue when doing a quick parse of PRO code. For almost 8000 files on a developer machine, we went from 13 seconds down to 3 with a parse rate of 650k lines/second!

For quick parsing, we now also extract docs for your code to give a better hover help and auto-complete user experience with a low impact to performance.

Fixed a bug where the IDL icon was pointing to the wrong file for light themes

Added a new button to the IDL sidebar which allows you to easily specify the location of IDL without needing to rummage through the command palette

Fixed some import bugs if you have an older version of node.js on your path where "performance" was undefined.

## 3.0.6 - July 2023

Improved message when language server crashes and a button that opens documentation for workarounds for the memory problem

Fixed a problem where we don't properly detect `node.js` on non-Windows platforms

Fixed a problem where the docs file wasn't being included

Add new preferences for tracking session history! This includes several new features:

- A new output channel that captures the input and output from your IDL sessions (i.e. `print, 42` and the text `42`). This output channel is called "IDL: Session History"

- A system to also write all input and output to a file on disk. You can control:

  - If we write a file on disk or not

  - The folder (default value is `${.idl}` which is the path to your `.idl` folder in your home location with a `vscode` subdirectory)

  - The name of the file (the extension of ".idllog" gives syntax highlighting when open for improved readability)

  - Size limit for the file which is truncated on start of the language server if it exceeds our limit.

  - If we always clear (truncate) the contents of the file when IDL starts

Add basic variable substitution for the environment preference and the folder for tracking history.

- This is added as a new link in the docs that is included with the extension

## 3.0.4 - July 2023

When `compile_opt` is not present with idl2, idl3, or strictarr, delineate between function calls and indexing with parentheses. It won't parse 100% correctly, but it allows us to identify and fix parentheses.

- New error code (105 with alias "illegal-var-index")

- Automatically gets fixed when formatting if you have auto-fix enabled (true by default)

## 3.0.3 - July 2023

Expose ability to set environment variables for the IDL process that appears in the debug console

## 3.0.2 - July 2023

Fixed a bug with documentation being generated when using the VSCode UI

When executing batch files, wrap the path in quotes like compile

When told to start a session of IDL, add button that will let you start IDL from the dialog that appears

## 3.0.1 - July 2023

Fix badge URLs now that the extension is live

## 3.0.0 - July 2023

- Added a new theme "Neon IDL" with some fun, neon colors for syntax and the VSCode interface!

- Re-swizzed the "Retro IDL" and "Novus IDL" themes. Retro IDL should look much better than it did with colors that pop a little more.

- Checks for common syntax errors and provides feedback based on what is found.

- Outline for PRO code has been updated to include different icons based on methods vs standard routines and also captures the main level program start.

- Completely revamped syntax highlighting that highlights based on your syntax. It is a great visual way to see where you have syntax problems as highlighting will dramatically change based on what expressions are allowed to be found or not.

  - Additionally, see the file `extension/docs/CUSTOMIZING_THEMES.md` for the TextMate scopes used for IDL which you can customize to look how you want in any theme.

- Added a new file icon theme that adds a new IDL icon for light and dark modes.

  - Supports .pro and .sav files

  - This icon theme is an extension of the default file icon theme that ships with VSCode.

  - On startup, IDL will ask if you want to switch to this if not the default theme.

    - A new preference has also been added to not ask about this again

  - Every time the extension is built, we automatically fetch the latest version of the default icon theme to stay up-to-date

- Fixed a bug with hover help no longer working

- Hover help for internal (i.e. core IDL or ENVI routines) has been completely redesigned and includes examples and content from the IDL, ENVI, and module docs

- For internal hover-help, we also support embedding images within the help. If you don't have IDL installed, or the required module that the help comes from, we use the hosted links to docs from our website so that all extension users have an opportunity to experience the docs.

- For internal routines, any links to other content/pages also work and transfer you to our docs website.

- Revamped auto-complete that is now context aware of your current cursor location and the code around it. This helps provide streamlined and smaller lists of auto-complete items.

- The results from auto-complete now have smart sorting text applied. There general order is:

  - Variables

  - Properties

  - User procedures, functions, or methods depending on context

  - Internal procedures, functions, or methods depending on context

- Code blocks in hover help, as long as they are valid IDL code without syntax errors, all have consistent formatting applied for a more normalized experience viewing example IDL code. The formatting also lines up with modern IDL styling.

- Updated the out-of-the-box routine lookup for IDL 8.8.2 and ENVI 5.6.2 and updated them to follow the new patterns for internal routine storage/docs

- Full support for user documentation using the IDL Doc style

  - This provides complete feedback for your documentation and help guide you to creating consistent and correct docs to make your code easier for others to understand

  - These docs follow through to hover help for user-defined routines and variables

  - For variables, simply add a "+" after a single line comment just before a variable gets defined and it will show up as docs

  - The documentation for arguments and keywords will also fall-through to the internal references inside of procedures and functions

  - User created documentation will show up as hover help

  - For IDL Doc formatted docs, custom hover help for key parts of the documentation.

  - Syntax highlighting that makes IDL Doc formatted docs pop out and much easier to read compared to a block of comments.

- Go-to definition not supports variables inside of routines

- Enhanced features for debugging:

  - Each time a debug session of IDL starts, it sets the `IDL_PROMPT` environment variable to reset the prompt back to `IDL> `. This is to help ensure stability because the extension does not support prompts other than `IDL> ` or `ENVI> `. If your prompt does change, then you can stop and restart the debug session of IDL which will update the preference back to default.

  - No extra spaces for every command that runs

  - When not on Windows, the pause button works and correctly interrupts execution.

  - A new Status Bar indicator to easily start IDL and/or see when IDL is busy and executing something

  - Added support for `.edit` and `.compile` to open PRO files automatically like the IDL Workbench

  - Resolved an issue where, when using IDL on Mac or linux, the IDL_DIR environment variable was not set which broke IDL's search path.

  - Running a file now checks for main level programs, procedures, and functions. After compiling the file, we check for, and execute, in that order of detected routines. There will be some goofiness if we change a procedure to a function and don't reset the IDL session, otherwise it works great.

- IDL WebView no longer tries to download material icons from the internet and they are packaged with the web app.

- Cleaned up extension configuration to remove unused preferences

- Alert configuration uses callbacks to make it easy to get additional information or help with problems that appear. Specifically:

  - Problem files can be opened from the dialogs that appear

  - If IDL is not found, and you try to start a session, you can click a button on the dialog to pick the folder where IDL lives.

- Developer changes:

  - Migrated source code to NX for nice, monorepo management and reorganized most of the code. A majority of the features/functionality live in the "libs" folder for easier addition of unit tests and it allows for sharing code between client and server applications.

  - Updated all dependencies to the latest major versions (as of 4/30/2022), including the latest VSCode extension API which is mostly new/separate packages for functionality.

  - The package.json file is now generated programmatically and verified for errors with missing images, translations, and always uses the commands that should be configured within the application. This additional complexity helps add a layer of automation to manage the package.json file which can get complicated with a lot of features.

  - Improved alignment of printed output for the extension logging and dramatically simplified internal code for how logging is managed

  - Basic developer docs for all components of extension

  - Refactored code for hover help and go-to definition to use the new, internal token index

- Listen for and nicely close IDL when "exit" is typed as a command in the debug console. Key behavior: when you type `exit` into VSCode, it will not execute **any** statements and simply stop the interpreter. This is to avoid the pop up telling you that IDL has crashed.

- Properly handle multiple commands that are executed in the debug console and join all statements with "&" (IDL's line separator character). This still limits you to executing single-line statements (i.e. no block statements with "begin" or "end"), but handles cases where you can write statements with line continuations all at once.

- VSCode now will attempt to automatically indent your code using expressions like "pro", "function", and "begin".

  - Note that this functionality is limited because of VSCode. For this to work, your control statements need to be all upper case or all lower case. No mix and match.

  - The rules also attempt to be helpful and indent inside of arrays, parentheses, and structures.

- New and improved syntax highlighting following some patterns that VSCode uses for languages. It now:

  - Uses YAML as the source which makes it 1/3 to 1/2 the original size as plist XML

  - Allows for comments to elaborate on why an expression might be the way that it is

  - Dramatically easier to read and write

  - Allows for the use of variables to add re-usable regular expressions for tokens which minimizes user-error when programming

  - Takes the modern, and correct, approach of using recursion to attempt to define what tokens/children are or are not allowed

  - This means that, as a developer, you should see or not see syntax highlighting based on your code being correct or not

    - For example, nested routine definitions are not allowed and now not highlighted

- Properly include licenses, copyrights, and credits for third party dependencies used in the source code of the extension.

- For developers, syntax tree tokens have overloads for hover help to allow for custom experiences outside of the global (i.e. routine defs) and local (i.e. variables) hover help.

- Two entry points for automatically initializing "idl.json" files for users.

  - First, we will check each workspace that you open and, if there is no "idl.json" file, then you will get an automated message asking you if you want to create one. On a workspace-by-workspace level, you can disable these messages if they get annoying.

  - There is an entry in the IDL tab of the sidebar that will let you manually create an "idl.json" file for any open workspace, provided it does not already have one in it.

## 2.0.0 - 2020-01-14

Lots of exciting changes!

- DEBUGGING!

  - (Mostly) Full debugging just like in the IDL workbench

  - Pausing doesn't work, but breakpoints, stops, and all of the other commands that you expect from the IDL Workbench are here.

  - Custom buttons to compile files, reset the IDL session, and "Run" a file (just like the "Run" button in the IDL Workbench).

- Terminal Commands

  - Separate from debugging, these allow you to run IDL in the VSCode terminal window without interactive debugging functionality

- Profiling!

  - Not as slick as the IDL Workbench, but the same style of functionality. Use the IDL View or commands to start and stop profiling.

- Preferences

  - Basic preferences to help out with debugging

- Themes! Feeling retro? Check out the `Retro IDL` theme. In the mood for a modern, dark theme? Experience IDL syntax highlighting with the `Novus IDL` color theme. See the **Credits** section of the readme for the original source of the themes.

  - If you feel like customizing the IDL themes, check out the theme JSON files. The IDL tokens are all at the top and it is pretty easy to customize the way PRO code appears. Pro tip: if you do this, VSCode does a live-reload so you can see your changes instantly!

- Code refactor. Not as exciting, but we have a good number of _major_ changes to the way the code in the repository is written:

  - TSLint (although it will soon be deprecated) and steps for getting able to contribute

  - Prettier and TSLint integrated into the node scripts prior to packaging to force the code to have the same style

  - All files have been adjusted according to prettier and TSLint

- Syntax highlighting

  - When pairing the themes with this extension, there were a few bugs fixed with the colors not appearing right based on your color theme.

  - There is separation in color between functions, procedures, function methods, and procedure methods. There is no delineation between user defined and internal routines at this point. The highlighting also extends to where they are defined in PRO code.

- Tree view

  - New tabs and buttons for executing additional commands by clicking n buttons

  - Some updated icons as well

- Webview

  - A custom view that can be used to display any information we need.

  - Follows most of the best practices for the webview, including state management. It will remember where it last left off, even between closing and opening sessions.

- Support for internationalization (i18n)

  - For client (ext) and webview as well. All new code should be written to support i18n so that we will always be covered.

  - Custom workflow for generating the files needed for i18n which is simple, used for the whole extension, and error-proofs users from having missing JSON key/value pairs or typos with JSON keys.

- Logging

  - Proper extension logging when not in debug mode.

  - Error messages prompt the user by default to view logs.

- Additional Development Updates:

  - Migration to webpack for the extension client

  - Total extension size is about 1.2 MB with 73 files, most of which are images and necessary files for the language!

  - As new folders have been added, migrated all content specific for the language to the `language` folder to keep things more organized.

- Workspaces:

  - Properly listen for files being added and removed from workspace

  - Fixed a _major_ bug where the glob library used for file searching would exceed the call stack and we wouldn't have our true intellisense.

- Support for `todo` statements if they follow the form of:

  - `; TODO: some note here` where the actual `TODO` can be upper or lower case

## [1.7.0] - 2019

Added commands for the buttons added to the sidebar

Enhanced the way that IDL is auto-detected on Mac + Linux by checking IDL_DIR (from idl_setup.sh in the install location)

## [1.6.1] - 2019-10-05

Fixed a bug with problem detection that didn't properly clear

Updated dependencies to VSCode 1.38

## [1.6.0] - 2019-09-03

Small syntax fix for control statements in keywords

New feature with hover help for built-in routines in IDL. Returns first match found if the names are the same as the symbol being extracted.

Hover help returns markdown with link to the official docs for built-in routines

Logic for detecting symbols for hover and auto-complete

- Aware of function, procedure, and method

- Completion results are then returned based on what symbol is extracted, so we have situational-appropriate results. For example, function auto-completes when we have a `(` in our name or an equal sign on the left hand side. This also helps speed things up.

- Added in all ENVI + IDL object methods, so that is why we needed search filtering. Our total went from about 1300 to 4000 docs entries

- Refactored the storage and addition of symbols for user-defined routines for faster access and easier cleanup when closing documents

## [1.5.5] - 2019-09-01

These features are mostly development updates and not super exciting, new features.

Server: abstracted providers/helpers and wrapped in single API for being able to test

Added testing to the extension:

    - Use mocha for testing the extension **client**

    - Use AVA for testing the extension **server**

    - NPM script from main folder to run all tests

When publishing/packaging the extension, unit tests are automatically executed which also builds the extension.

    - **BREAKING CHANGE FOR DEVELOPMENT:** You can no longer publish from a terminal in vscode and no terminals can be active. This is because of the vscode examples followed for how tests are executed.

Bundle size is about 700kb compared to previous size of 2.8mb.

    - Number of files is ~160 compared to ~1k

    - Reductions came from using `@types/vscode` instead of `vscode`and manually excluded some node modules used just for development.

Linting with prettier added back in

    - **BREAKING CHANGE FOR DEVELOPMENT**: Required VSCode and the [Prettier - Code Formatter](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) extension. Settings are saved in this repository.

## [1.5.4] - 2019-08-29

Fixed regex for variables, it was picking up multi-line statements.

## [1.5.3] - 2019-08-27

Auto complete for variables in-file and all routines that have been discovered for your instance of VScode (from workspace and files you have opened)

Fix for incorrect syntax highlighting of the control statement `end`

Enhanced (and fixed) go-to definitions for functions, procedures, and methods (procedure and function)

## [1.5.2] - 2019-08-25

Corrected the way to add syntax for IDL + ENVI tasks, ENVI style sheets, and ENVI modeler files.

Added basic task schema validation for:

- ENVI Tasks before ENVI 5.3

- ENVI Tasks after ENVI 5.3

- IDL Tasks, which were introduced in IDL 8.5.2

## [1.5.1] - 2019-08-23

Webpacked the language server to reduce files by about 50% and size to 3.3 MB from about 5 MB

## [1.5.0] - 2019-08-23

Added an initial IDL language server for more features. It contains capabilities for:

- Searching through symbols (procedure/function/method definitions) with VScode's symbol searching

- Support for finding routine definitions in a workspace

- Go-to definitions for routines

- Auto-complete for built-in IDL routines when typing procedures or functions out

- Duplicate routine definition detection for files open in VSCode or the workspace, not for IDL's search path

- Duplicate routine definition detection against documented ENVI + IDL routines

- Simple controls for starting a basic IDL Console window with the ability to compile, run, and stop executing IDL code. There is no debugging, but it is better than nothing!

## [1.4.1] - 2019-05-16

Bump required vscode version to 1.33.0 to resolve security vulnerabilities.

## [1.3.0] - 2018-04-11

Added new package to package.json for adding contributors. Updated the readme and added attribution to Mike Galloy, Chris Torrence, and Zach Norman.

A lot of changes have been made to improve the colorization of IDL's procedures which are challenging to delineate from standard text. In general here are the changes that have been made:

- Added a "test" file with many sample cases for easy comparison when testing the syntax highlighting. Any problems are at the top of the file, everything else is a reference for what things should look like.

- Procedures now highlight correctly when you have single-line if statements of the form `if (this) then print, 'that'`. Does **not** work if you have a line continuation after the `then` statement.

- Added code for line continuations to prevent false positive procedures from being highlighted. This requires you to indent the next line (as you should anyways) otherwise the rest of your file is highlighted incorrectly. With this change, properties are not colored correctly on the next line. Not sure why this is happening, I'm guessing another group is grabbing the text and preventing the highlighting, but this is better than highlighting too much. Holding off on exposing this as it has the potential to cause more problems than it solves.

- Some of the procedure captures have been consolidated and simplified.

- New groups have been added in the tmLanguage file for braces, switch-case, and line continuations. See the note on line continuations above.

- With the new capture groups, structure tag names have been limited to braces.

- With the new capture groups, there is special syntax to highlight procedures and procedure methods correctly inside switch or case blocks.

- Fix with properties highlighting correctly in elvis operators, i.e. `(this) ? something.that : this.that`

- Snippets have been improved and organized (may have been snuck into the last release)

- Added the all-contributors NPM package to the package.json file for adding a nice attribution section to the README as other people contribute.

## [1.1.0] - 2018-04-02

- Organized and restructured the language file

- Registered the `;` as the comment character for IDL and VSCode's auto-comment feature now works as expected.

- The syntax highlighting is now generic and will highlight any function, procedure, function method, or procedure method accordingly.

- Structure/object properties are highlighted when setting/getting, including those on system variables.

- Structure names and `inherits` keys have their own styling.

- Structure tag names have their own styling

- Executive commands are styled

- All system variables now highlight correctly.

- There is code for colorizing structure tag names, but it has too many false positives when accessing arrays with syntax like `arr[start:finish]` so it has been commented out.

- .task files are now colored as JSON thanks to [VSCode](https://github.com/Microsoft/vscode-JSON.tmLanguage)

## [1.0.0] - 2018-01-08

- Initial release

- Includes snippets and idl.tmLanguage from Mike Galloy
