# Parser

This library orchestrates parsing of IDL code, creating the syntax tree, and checking for errors.

This library relies upon these libraries (it does something special for the syntax checking plugins) to make the magic happen.

- **syntax-tree**" Manages creating the syntax tree from tokens in the code
- **syntax-validators**: This library add our syntax checkers to the syntax tree when imported alongside the syntax-tree.
- **tokenizer**: Library for parsing and converting code into tokens
