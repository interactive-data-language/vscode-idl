# extension

Contains extension-specific files that are not typescript.

## Folders

- **dev-docs**: Developer docs for the extension, not for general use, just for developers.

- **docs**: Documentation for the extension. Markdown and anything else!

- **icon-theme**: Customized icon theme updates with each run of `npm run build-package-json` to add a custom icon for IDL and ENVI related files. Needed to overwrite current themes which have icons for .pro files as prolog.

- **images**: Contains SVG images used for the extension with a light and dark mode version of each icon.

- **language**: Is where we configure VS Code to work with the IDL language. See below for more details.

  - **schemas**: JSON schemas that we consume in the extension. Primarily for ENVI and IDL task files, but easy to grow to other ENVI + IDL file formats.

  - **snippets**: Is where we have the auto-complete code for things like for loops and if statements

  - **syntaxes**: Has the syntax highlighting and configuration for brackets/quotes etc.

  - **themes**: Holds the custom themes we have created for IDL and VS Code.

- **translation**: Files related to translation for our extension (more advanced items like hover help)
