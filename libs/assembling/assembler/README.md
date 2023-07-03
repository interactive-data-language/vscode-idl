# Assembler

The main entry point for code formatting and writing tokens to disk.

This library uses the matches and token names in order to format code.

## Formatters

- **Fiddle**: Formatter for IDL (FFIDL as Fiddle) is the code that does the work of consistently writing code to disk, independent of styling. This tool follows established patterns by tools like [prettier](https://prettier.io/) where we:

  - Allow for minimal configuration so the appearance of most code remains similar, making it easier for users to work amongst each other.

  - Makes minimal adjustments to the code itself apart from a few formatting consistencies. These are, at the time of writing this, limited to only:

    - Changing quotes based on preferences

    - Limiting comments to one semi-colon

    - Normalizing non-comment block comments to be consistent

- **HTMLIzer**: (Incomplete) Re-implemented from IDL, converts code to a format that can be embedded in Markdown or web pages to bring your code examples to life!
