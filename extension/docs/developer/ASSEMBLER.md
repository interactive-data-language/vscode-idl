# Assembler

This document is meant to talk about the structure of the assembler at a high level.

The main school of thought for the assembler is that there are two pieces:

1. Style which controls how statements appear (i.e. upper case, lower case, etc.)

2. Formatting controls where statements appear (i.e. spacing and indentation)

## Organization

The organization of the assembling code follow this practice and it used to format code. Here are the important libraries:

- **config** loads and contains types for the assembling configuration

- **tree-handlers** reference classes and types to normalize any new or custom stylers to have the same look at feel

- **styles** exports our tree handler classes which have a normalized tree iteration technique built in

- **formatters** to, without any styling information, change the appearance of tokens. This library has NO access to the assembler config as the spirit of this code is to adjust spacing of tokens which can be done without external inputs.

- **assembler** which applies styles, formatting, and puts the code together.

## Process

Assembling has three key steps when formatting code:

1. Apply styles to our syntax tree. Modifies tokens in-place. About 90% there to add other style sets.

2. Apply formatting to our syntax tree. Modifies tokens in place, depending on the rule set that is picked. Only one is available right now.

3. Piece the code together into lines and, using information about nearby tokens, we add spaces before/around.

4. Convert the individual lines of code into an array and manage spacing in doing so
