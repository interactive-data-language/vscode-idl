# idl

This library is where we manage creating and interacting with spawned IDL processes. All interactions with VSCode or references to VSCode have been removed from this library so it can potentially be re-used outside of the debug adapter.

For an example of how to use this, see `idl-debug-adapter.class.ts` which shows the events to listen to near the top of the file. You can see any interactions with the `_runtime` property which represents this lib.

## Important Notes

When interacting with the output from a spawned session of IDL, note that the string results are going to be weird.

What does that mean? String are not guaranteed to be a single line. They may be split at arbitrary locations.

So, anything that you as a developer does when working with output from IDL, will need to account for this. Mostly it should be removing new line characters from output that you know shouldn't have it.

Here's an example of what you might need to do from the `editProCodeFile` method in `idl-debug-adapter.class.ts` file:

```typescript
const cmd = `print,(file_search(strtok(!path,'${delimiter}',/extract) + '/${moduleName}',/nosort))[0]`;

// trim to remove any excess new lines and remove any new-lines that may have been
// printed out
const fullPath = (
  await this.evaluate(cmd, {
    silent: true,
    echo: false,
  })
)
  .trim()
  .replace(REGEX_NEW_LINE, ''); // <---- RIGHT HERE

// attempt to open if we found a file
if (fullPath) {
  const file = vscode.Uri.file(fullPath);
  vscode.commands.executeCommand('vscode.open', file, {
    preview: false,
  });
}
```
