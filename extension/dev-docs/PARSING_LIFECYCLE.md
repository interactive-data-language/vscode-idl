# Parsing Lifecycle

This outlines the steps that we go through to parse IDL code. This is meant to call out how code is parsed and the best places to add certain pieces of functionality.

## Order of Operations

The place to see where this is implemented in the code is in the file libs/parsing/parser/src/lib/parser.ts.

In there, the function `Parser` goes through the following steps:

1. Extract tokens

   File: libs/parsing/tokenizer/src/lib/tokenizer.ts

   This turns it into a flat array of tokens with a name, type, position information, match details, and a bit more.

   This is the most basic representation of the code part from the text itself.

2. Build syntax tree

   File: libs/parsing/syntax-tree/src/lib/build-tree.ts

   Takes the flat token structure and turns it into a recursive syntax tree.

   Creation of the syntax tree includes several steps.

   1. Build initial tree

   2. Populate the scope for tokens (i.e. all parents) which is used in the next step

   3. Apply post processing to transform, reduce, or replace tokens

   4. Regenerate scope for items that may have changes. Yes, extra step, but one major thing we don't have to do when we post-process

   5. Validate entries of our syntax tree (syntax checking)

   6. Apply syntax validators for the entire tree (special case)

3. Populate global tokens

   This is a two step process. We go through and identify any global tokens in our syntax tree (i.e. things that you can access from anywhere in IDL code) and, depending on what was detected, we extract information about the context for that global token.

   For example: We extract routines and then, for each routine, we get local tokens like variables so we have access to hover help

4. Populate local tokens

   For non-global tokens at the top level of a tree, which is only main level programs, we extract any local variables.

   This is a second step because main level programs are NOT stored globally.

   The only thing we store about main level programs in a global scope is if we have one or not to populate the outline in VSCode.

5. Post-process syntax problems

   This critical-to-user-experience-step is something that we do to filter out excessive problem reporting.

   For example: if we have an unclosed token (i.e. parentheses), there will be cascading syntax errors. We want to reduce those and not show any other errors that come after.
