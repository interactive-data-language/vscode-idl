# Format on Save

We recommend using format on save to automatically keep your code styled nicely and up-to-date with docs.

The first time you start the extension you will also be prompted to enable format on save for PRO code using the extension as the formatter.

If you opted-out, then see below for details on how you can enable it.

::: tip
You can also enable formatting on save for notebooks!
:::

## Troubleshooting and Setup

You'll need to enable "format on save" and set a default formatter if you want code to be formatted automatically when you save a file. If you opt-in using the dialogs that appear in the extension, this will be set up automatically.

If not, or you are having problems, then you'll need to manually update your user settings. Here's how you do that:

1. Open the command palette (Ctrl + Shift + p)

2. Search for "Open User Settings (JSON)"

3. Add the following to the JSON that appears, which formats on save and select the formatter for only PRO code (so you it doesn't impact other languages):

```json
{
  "[idl]": {
    // use the IDL extension as the formatter for PRO code
    "editor.defaultFormatter": "idl.idl-for-vscode",
    // format on save for PRO files, nothing else, this can be at the root level too or language-scoped
    "editor.formatOnSave": true
  },
  // OPTIONAL - format on save for notebooks needs to be enabled at the root level
  "notebook.formatOnSave.enabled": true
}
```
