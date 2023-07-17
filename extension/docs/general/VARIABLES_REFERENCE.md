# Variables Reference

Visual Studio code has a concept of [Variables Reference](https://code.visualstudio.com/docs/editor/variables-reference) to allow for short-hand strings to identify home folders, workspaces, etc.

The IDL extension supports some of these and they are checked for the following preferences:

- Environment variables used when IDL starts

- Getting the location of the folder that IDL generates output to

## Supported Variables

> Pro tip: These variables are all case-insensitive

> Pro tip: You can use forward slashes for paths on Windows (helps if you use Linux/Mac and Windows)

You are allowed to use one of the following variables in a given expression. The table indicates the order that we check and, after we find one matching variable, we return and do not keep checking.

| Variable             | Description                                                                                                         | Example Folder                                         |
| -------------------- | ------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------ |
| `${.idl}`            | The user's `.idl/vscode` folder                                                                                     | C:\Users\AwesomeUser\\.idl\vscode                      |
| `${userHome}`        | The user's home folder                                                                                              | C:\Users\AwesomeUser                                   |
| `${workspaceFolder}` | The currently open workspace. Uses the first if more than one. Defaults to `.idl/vscode` if no workspaces are open. | C:\Users\AwesomeUser\Documents\node\awesome-vscode-idl |

## Syntax Examples

Here's an example of how you can use these variables:

```json
{
  "idl.IDL.environment": {
    "IDL_STARTUP": "${workspaceFolder}/startup.pro",
    "MY_VAR": "${.idl}/myfile.pro",
    "OTHER_VAR": "${userHome}"
  }
}
```
