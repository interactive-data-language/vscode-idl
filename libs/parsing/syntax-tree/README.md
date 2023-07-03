# Syntax Tree

This library builds a syntax tree from extracted tokens in code. While building the syntax tree, there are several built-in problems that we attempt to detect. In addition to this, the exported IDL_SYNTAX_TREE_VALIDATOR allows you to add custom rules for checking basic tokens (like numbers), checking branches (like an if statement), or checking the whole tree (all code in a file).
