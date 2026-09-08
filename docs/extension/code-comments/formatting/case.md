# Case Rules

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
