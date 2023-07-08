# Change Log

All notable changes to the "idl" extension will be documented in this file.

For much more detail, see our [developer notes](./extension/docs/developer/dev-notes/README.md).

## 3.0.4

When `compile_opt` is not present with idl2, idl3, or strictarr, delineate between function calls and indexing with parentheses. It won't parse 100% correctly, but it allows us to identify and fix parentheses.

## 3.0.3

Expose ability to set environment variables for the IDL process that appears in the debug console

## 3.0.2

Fixed a bug with documentation being generated when using the VSCode UI

When executing batch files, wrap the path in quotes like compile

When told to start a session of IDL, add button that will let you start IDL from the dialog that appears

## 3.0.1

Fix badge URLs now that the extension is live

## 3.0.0

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
