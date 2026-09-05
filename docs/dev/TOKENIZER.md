# Tokenizer

This developer doc talks through the approach and algorithm for how tokens are extracted from IDL code.

> Pro tip: Before diving into this, you should familiarize yourself with how [syntax highlighting](./SYNTAX_HIGHLIGHTING.md) functions which follows the same pattern

## Structure

The tokenizer follows nearly exactly the same concept as TextMate grammars where you have:

1. Basic tokens that have a specific pattern they are searching for

2. Non-basic tokens which have a beginning and and end

3. For non-basic tokens, you get to declare what nested tokens are searched for

### Code Location

Here is the organization and structure of the tokenizer code:

- Primary token definitions, similar to the top of the YAML Textmate file

  `libs/parsing/tokenizer/src/lib/tokens/def-groups.interface.ts`

- Actual token definitions:

  `libs/parsing/tokenizer/src/lib/tokens/defs`

- Child tokens:

  Primary: `libs\parsing\tokenizer\src\lib\tokens\sub-defs.interface.ts`

  Secondary (shared) at the bottom of: `libs/parsing/tokenizer/src/lib/tokens/def-groups.interface.ts`

If you have reviewed the YAML file, you might be wondering why there are three files containing the code? That is to ensure we do not have circular dependencies like we do within the YAML TextMate file (i.e. `file 1` requires `file 2` which requires `file 1`). This can, however, be improved in the future.

### Algorithm

Here is how tokens are found:

1. Before any processing is executed, the tokenizer filters out empty or comment-only lines

2. For each line we:

- Use the group of tokens we are searching for and check each token against our string

- If we find a match at the beginning of the string we immediately break as it has "won"

- Shift and, if a non-basic token, then we update the child tokens that we can search for and recurse

3. Once we have found a token, and after it is saved, we shift through the string and remove any white space to reduce complexity of regular expressions.
