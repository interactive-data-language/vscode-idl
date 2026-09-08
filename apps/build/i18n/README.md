# i18n

This app is very simple - just one script that processes our TS definitions for translation and makes the proper translation files for VS Code and our webview in VS Code.

When running the compiled app, a folder called "i18n" is also generated in the **dist** directory and the associated `package*.nls.json` files will be created in the root directory. The `nls` files are used for VS Code to translate text in the UI.

The core of the translation information lives in the `translation` lib.
