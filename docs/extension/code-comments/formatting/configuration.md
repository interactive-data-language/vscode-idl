# Formatting Configuration

As a user, you have full control over the configuration and style of the code that gets formatted.

::: tip
We curated the default formatting rules for IDL to help present a fresh, modern feel to our beloved language.

If you are like us, and have been using IDL for a long time, we challenge you to try it out and see how your code can look with our default and modern styles.
:::

## Settings

::: tip
All of these settings can be accessed from within the extension.

Navigate to the IDL sidebar as select "Open Extension Settings" to find them.
:::

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
