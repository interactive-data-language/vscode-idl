# Rules and Behaviors: Case and Spaces

Here you'll find some more information about the rules for the case of your code and how we handle spaces when we format.

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
