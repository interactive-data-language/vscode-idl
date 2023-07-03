# tmLanguage Maker

> See `extension\docs\developer\SYNTAX_HIGHLIGHTING.md` for more details

This app is very simple: it is meant to take a YAML tmLanguage file and convert it to the standard plist/textmate (i.e. XML) format that VSCode natively supports.

## Usage

Using this lib is very easy. All you need to do is run:

```shell
nx serve tmlang-maker
```

And, as you make edits to the `extension/language/syntaxes/src/idl.tmLanguage.yaml` any changes will be live-reloaded and the plist file will be automatically updated for you.

After any changes are made, you should refresh your debug session of the extension to pick up any changes.
