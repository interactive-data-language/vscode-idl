# Spacing Rules

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
