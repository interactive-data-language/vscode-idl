# syntax-post-processors

> All post-processors must be added to `index.ts` as an export in order to be activated.

Custom post-processors for syntax to map token types to other types. Helps keep the tokenizer simple and avoids having too many tokens and regular expressions that we always have to check for.

In order to add new rules, follow some of the examples in `src/lib/post-processors` and add as an export in `src/index.ts`

Tests should be added to `parsing/parser` via automated tests to avoid circular dependencies.

## TODO

- convert quotes that are numbers to numbers
- convert variables + basic assignment to keywords in routine definitions
- convert variables + assignment in routine calls to keyword setting
  maybe adjust the assignment operator to be the basic one in routine calls like we routine definitions
