# Formatting

Here you can find some basic information about formatting your code!

## Troubleshooting: Format on Save

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

## Settings

Here's a JSON view of all settings for formatting code in the extension:

```json
{
  "autoFix": true,
  "autoDoc": false,
  "styleAndFormat": true,
  "tabWidth": 2,
  "style": {
    "quotes": "single",
    "methods": "dot",
    "keywords": "lower",
    "properties": "camel",
    "control": "lower",
    "numbers": "lower",
    "hex": "lower",
    "octal": "lower",
    "binary": "lower",
    "routines": "match",
    "routineMethods": "camel",
    "systemVariables": "lower",
    "structureNames": "pascal",
    "localVariables": "match"
  }
}
```

You can manage settings for formatting code directly from the VSCode Settings UI. All of the "style" options also allow you to specify `"none"` to turn that off.

| Setting                 | Description                                                                     | Example                               |
| ----------------------- | ------------------------------------------------------------------------------- | ------------------------------------- |
| `autoFix`               | If there is a problem we can fix, when you save/format a file, fix them         |                                       |
| `autoDoc`               | When we format/save a file, add or update documentation for routines            |                                       |
| `styleAndFormat`        | When we format/save a file, do we apply our styles and format?                  |                                       |
| `tabWidth`              | Number of spaces per level of indentation, default is 2                         |                                       |
| `style.quotes `         | Single or double quotes for strings. Also applies to numbers made using strings | `'this'`, `"that"`                    |
| `style.methods`         | Arrow (->) or dot (.) when invoking class methods                               | `obj->method`, `obj.method`           |
| `style.keywords`        | Upper or lower case for keywords                                                | `myfunc(kw1 = 5, /kw2)`               |
| `style.properties`      | Upper, lower, pascal, camel, or match case for properties                       | `!null = var.prop`                    |
| `style.control`         | Upper or lower case control statements                                          | `for`, `begin`, `pro`                 |
| `style.numbers`         | Accents for numbers to specify type, upper or lower case                        | `5l`, `42ull`                         |
| `style.hex`             | Upper or lower case for hex numbers                                             | `0xaef`                               |
| `style.octal`           | Upper or lower case for octal numbers                                           | `0o0123`                              |
| `style.binary`          | Upper or lower case for binary numbers                                          | `0b010101`                            |
| `style.routines`        | Pascal, camel, match, or no formatting for functions and procedures?            | `ENVIRaster()` or `myPro`             |
| `style.routineMethods`  | Pascal, camel, match, or no formatting for procedure and function methods?      | `obj.myMethod()` vs `obj.fooBar`      |
| `style.systemVariables` | Upper or lower case                                                             | `!NULL`, `!x`, `!y`                   |
| `style.structureNames`  | Pascal, camel, match, or no formatting for structure names                      | `a = {MyStruct, inherits StyleMeToo}` |
| `style.localVariables`  | Do we match the case/style of the first instance of a variable?                 |                                       |

## Case Rules

Here's a small table with examples and definitions of each type of case transform:

| Case Style | Description/Example                                        |
| ---------- | ---------------------------------------------------------- |
| Upper      | UPPERCASETEXT                                              |
| Lower      | lowercasetext                                              |
| Pascal     | PascalCaseText                                             |
| Camel      | camelCaseText                                              |
| Match      | Matches the source definition or leaves alone if no source |
| None       | Do not change the case of the text                         |

When applying our case transforms above, we have a few special rules we follow:

- When you have any style set to `match`, we only match the source if we can identify the type and it is a known routine, property, structure etc. If we don't know what the formatted item is, then we leave the text as-is.

- When we don't know what a property, routine, structure, etc. is, then we give you the benefit-of-the-doubt and format the text that you have written out. This means the case transform will be based on what you type in some cases, and your mileage may vary, but it helps make sure that your code is more consistently formatted for methods and properties.

## Spacing Rules

Following the styles of popular formatters, such as prettier, we also adjust the spacing and "mechanical" appearance of your code. Also following those formatters, we don't expose any of these behaviors as parameters for consistency between different users.

Here's what we do:

- Automatically adjust indentation of lines of code based on blocks, procedures, line continuations, etc.

  - This also means that we automatically indent code for you, so you don't need to manually adjust the indentation and can write messy code that we will format for you when you save!

- Main level programs are have no indentation applied by default and are snapped to the start of lines.

- All lines of code, apart from literal strings, have additional space trimmed from the right-hand side. This removes lines that are completely empty.

- At most, you can have one empty line between IDL statements.

- For any blocks of code, such as begin...end or routine definitions, we remove empty lines between statements contained within and the start or end of the block.

- Routine comments should always be snapped to the routine definition itself without additional spaces.

- We have logic to add/remove additional spacing with all individual statements. This means we take something like `a=2+2+[3,4,5]` and turn it into `a = 2 + 2 + [3, 4, 5]` to help improve readability.

## Task Formatting

We re-use some of the style parameters for task file formatting as there is some overlap in concepts.

Below you will find which properties are used and how they control the formatting in tasks.

| Setting          | Description                                                     | Example                     |
| ---------------- | --------------------------------------------------------------- | --------------------------- |
| `style.keywords` | Upper or lower case for value of "keyword"                      | `"keyword": "keyword_name"` |
| `style.keywords` | Upper or lower case for the value of "name"                     | `"name": "my_parameter"`    |
| `style.control`  | Upper or lower case for the value of "direction" and "required" | `"direction": "input"`      |

Here's some context for why we chose those style options:

- The "keyword" tag in parameter task schemas maps directly to keywords in your code
- The "name" tag in parameter task schemas maps directly to a property when accessing the task in code
- The "direction" and "require" tags control the behavior of the parameter
