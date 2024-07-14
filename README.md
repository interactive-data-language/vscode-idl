# The Official IDL Extension for Visual Studio Code

<p align="center">
  <div align="center">
    <a href="https://www.nv5geospatialsoftware.com/Software-Technology/IDL">
      <img alt="Follow Prettier IDL Twitter" src="extension/images/idlicon.png"></a>
    <a href="https://www.nv5geospatialsoftware.com/Software-Technology/ENVI">
      <img alt="ENVI" src="extension/images/enviicon.png"></a>
  </div>
  <div  align="center">
    <i>
      <br> Brought to you by the creators of IDL and ENVI
      <br>
      <br>IDL is the go-to language for image processing and is the backbone for
      <br><a href="https://www.nv5geospatialsoftware.com/Software-Technology/ENVI">ENVI</a>, the industry-leading application for spectral and image analysis.
    </i>
  </div>
  <br>
  <div align="center" style="height: 2.5em;">
    <a href="https://marketplace.visualstudio.com/items?itemName=IDL.idl-for-vscode">
      <img alt="VS Code Marketplace Downloads" src="https://img.shields.io/visual-studio-marketplace/d/idl.idl-for-vscode"></a>
    <a href="https://marketplace.visualstudio.com/items?itemName=idl.idl-for-vscode">
      <img alt="VS Code Marketplace Installs" src="https://img.shields.io/visual-studio-marketplace/i/idl.idl-for-vscode"></a>
    <a href="https://github.com/interactive-data-language/vscode-idl">
      <img alt="GitHub Stars" src="extension/images/License-MIT-orange.png"></a>
    <a href="https://github.com/interactive-data-language/vscode-idl">
      <img alt="GitHub" src="extension/images/github.png"></a>
  </div>
</p>

<hr>

<div  align="center">
  <video controls autoplay loop muted playsinline style="max-width: 720px; width: 100%">
    <source src="https://vis-webcontent.s3.amazonaws.com/vscode-idl/vscode-tiny.mp4" type="video/mp4">
  </video>
</div>

**4.0.0 is here!**

This release headlines our newest feature: IDL Notebooks! The IDL Notebook format is standalone and only requires this extension to function (no extra dependencies on Python or Jupyter).

Within the extension, you'll find a new sidebar entry to help create a new notebook, open IDL and ENVI Notebook examples, and convert your IDL Notebooks to a PRO file as well. If you have questions, feel free to reach out to us on GitHub with any feedback or issues you encounter.

In addition to this, we have revamped our tools for styling/formatting your code to include other case styles like pascal and camel case.

That's not all that is included in this release, so check out the [CHANGELOG.md](./CHANGELOG.md) for full details.

> If you are looking to contribute, or get your development environment setup, see [CONTRIBUTING.md](./CONTRIBUTING.md).

---

This extension adds syntax highlighting, code snippets, debugging, problem reporting (undefined variables and syntax errors, 100+ in total!), IDL Notebooks, and much more for the Interactive Data Language (IDL) from NV5 Geospatial Software (formerly Research Systems, Inc.).

For a full list of changes, see [CHANGELOG.md](./CHANGELOG.md) for lots of details.

## IDL Requirement

Using the "debug" sessions of IDL requires that you have a version of IDL with lists, hashes, and orderedhashes (and the ability to parse/serialize JSON).

The extension is tested against:

- IDL 8.9

- IDL 9.0

Anything else is use-at-your-own-risk and may not work.

Notebooks have specific version requirements for IDL and ENVI:

- For IDL, you'll need IDL 8.8.0 or newer (enforced, and checked, when notebooks start)

- For ENVI, you'll need ENVI 6.0 or ENVI 5.7. Any other version of ENVI is not guaranteed to work.

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

## Known Issues

- Not an issue, but structure definitions are _only_ found in procedures that end with "\_\_define" following IDL's standard. If you define structures anywhere else, they will not be detected and you'll see a error regarding unknown structures.

- By default, the language server that parses your IDL code is limited to about 1.5 million lines of code. If you notice that the extension is running out of memory (language server crashes), one workaround is to install "node.js" and ensure that it is on your system path.

  When the IDL extension starts, if it finds node.js on your path, it will automatically start the language server using node, which should remove this limitation. If you still see memory errors, then reach out to us on GitHub and let us know.

  To install node.js, get the latest v18 release from https://nodejs.org/en/download/releases.

- As a part of the code that we parse, we also do our best to statically determine types and do type checking. If you notice issues with type checks being wrong, or there are incorrectly documented routines, let us know!

- The debugger is back and has some improvements. However, this is still a pre-release version of the ability to interactively run IDL code. For the next IDL release in late 2023 we are hoping to have this dramatically improved. Here's a few important things to know:

  - Pausing is not supported on Windows, this will hopefully be resolved in the near future. Currently it kills the IDL process and is being worked on.

  - If you find reproduce cases where syntax errors are not appearing, or are not going away, please file a bug report.

  - If syntax errors are not going away then you can: reset IDL, restart IDL, stop and start IDL again and they will disappear.

  - You may occasionally see some text that is printed to the console when IDL is running, this is a known bug that happens for a few rare cases and can be ignored.

## Release Notes

See [CHANGELOG](CHANGELOG.md).

## Credits

- For the licenses and copyrights of 3rd party dependencies for extension components, see [3rdpartylicenses.md](./compliance/3rdpartylicenses.md).

- Icon theme:

  - The icon theme is directly from [VSCode](https://github.com/microsoft/vscode/tree/main/extensions/theme-seti) and only modified to use a different icon for PRO files (use our own instead of the prolog owl icon). Credits and auxiliary files can be found in `./extension/icon-theme`.

- Themes

  - Original source licenses for the VSCode themes can be found in: `extension/language/themes`

  - Retro IDL: Licensed under MIT. Copyright (c) 2015 Mahmoud Ali, [Atom One Light Theme](https://github.com/akamud/vscode-theme-onedark)

  - Novus IDL: Licensed under MIT. Copyright (c) 2015 Mahmoud Ali, [Atom One Dark Theme](https://github.com/akamud/vscode-theme-onelight)

  - Neon IDL:

    - Based on: Licensed under MIT. Copyright (c) 2015 Mahmoud Ali, [Atom One Dark Theme](https://github.com/akamud/vscode-theme-onelight)

    - Some workbench colors from from: Copyright (c) ssmi, [After Dark](https://github.com/sssmi/after-dark)

- Syntax highlighting

  - Legacy highlighting theme based on Mike Galloy's [idl.tmbundle](https://github.com/mgalloy/idl.tmbundle). Has since been completely rewritten as YAML and following other patterns/different regular expressions, but some roots are still there.

- Icons

  - The icons used in VSCode either come from Material Icons (Google via npm "material-icons") or Material Design (Templarian via npm "@mdi/js")

  - PDF icon is from "Material Icon Theme"

- PDF Generation

  - We use a 3rd party extension called "Markdown PDF" to create PDFs

  - Credit goes to [yzane](https://github.com/yzane/vscode-markdown-pdf/tree/master) as the creator of this extension

## Usage Metrics

The IDL extension for VSCode collects anonymous usage data on the extension. The goal of this information is to improve the overall experience, focus development on tools that users work with the most, and make sure our software can run on the average user's hardware.

> IDL for VSCode uses the VSCode root preference for telemetry (`telemetry.telemetryLevel`) as an indicator if we should send usage metrics or not.
>
> To disable reporting usage metrics for VSCode, see [here](https://code.visualstudio.com/docs/getstarted/telemetry#_disable-telemetry-reporting) for more information.

To learn more about what we collect and why, view our [USAGE_METRICS](./extension/docs/general/USAGE_METRICS.md) guide.

## Legal

Copyright (c) 2023, NV5 Geospatial Software, Inc.

Licensed under MIT, see LICENSE.txt.
