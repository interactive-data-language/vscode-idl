# About

> See `extension\docs\developer\SYNTAX_HIGHLIGHTING.md` for more details

This folder contains the source syntax files for the IDL extension in vscode.

Stored in a separate file for live-reloading in dev and we do not need to include any of these files with the extension.

If these files are in the same location as the folder above, then we get in an infinite live-reload loop on file changes.

To start watching and re-build on changes, use `nx serve tmlang-maker`
