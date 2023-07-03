# Parsing

This colder contains all code and shared libraries related to parsing, formatting, and working with IDL code.

## Libraries

Here's a short summary of the libraries in this folder:

- **docs**: Lib to manage parsing docs for IDL routines. This comes in after we create a tree and extract the comments.
- **index**: Utility to manage parsing IDL code, tracking tokens, and capturing problems to return to the user.
- **parser**: Main entry point for parsing IDL code and detecting syntax errors.
- **routines**: Manages loading the list of routines from disk that we use for docs, hover help, and checking for reserved names.
- **syntax-tree**" Manages creating the syntax tree from tokens in the code
- **syntax-validators**: This library add our syntax checkers to the syntax tree when imported alongside the syntax-tree.
- **tokenizer**: Library for parsing and converting code into tokens
