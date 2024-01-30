# Syntax Highlighting

This guide is to help developers to update the syntax highlighting in VSCode provided through the use of tmLanguage files.

> Quick history: the extension started with the standard plist XML format for tmLanguage. After seeing an awesome example using YAML, the same pattern was followed to make it much easier and more enjoyable to work with syntax highlighting. This was also needed to add proper highlighting for future language features (such as backticks).

Note that the source for the syntax file is found in: `extension/language/syntaxes/src/idl.tmLanguage.yaml`

## Introduction

You might be asking yourself, now why would we have this extra step? Well, for two reasons:

1. Editing XML sucks. As an alternative you can use JSON, but we have quite a few regular expressions that _also_ use quotes, so we don't want to have to deal with escape characters that will make the regular expressions that much harder to read.

2. We have some secret sauce (well not-so-secret) where we use a pattern established in [this](https://github.com/microsoft/TypeScript-TmLanguage/blob/master/TypeScript.YAML-tmLanguage) file which uses variables and a special substitution syntax so that you can easily share regular expressions or other information between different expressions. For example: we can have a constant with the token name for control statements and use that in the ~15 places we need it.

3. So not exactly 2, but we need an automated solution for this to really work. There's an extension that can help, but it has some bugs and requires you manually running commands. Just not very useful/helpful, so we have our own NX app that makes developing and testing so much easier.

## Fundamentals

- The tmLanguage engine uses Onigurama as the regex engine itself

  - However, You can still write regular expressions using ECMAScript at regex101.com

- Only a single line is processed at a time. If you need to capture more than one line, you'll need to use something like how line continuations are implemented.

- If you are trying to capture more than one line at a time, your child regex expressions should capture the **entire** line so that no other tokens can win.

- In some places, you may need to add `\s*` to the beginning of regex expressions if other token types are winning (i.e. procedures vs variables or control statements)

- Fun fact: the only place, from a parsing perspective, line continuations are really needed is procedures, assignment, control statements with "arguments" and routine name definitions. Everything else has a discrete closing statement (i.e. array indexing, functions, structures)

## Writing or Updating Syntax

> Pro tip: Use the command "Developer: Inspect Editor Tokens and Scopes" to easily debug any issues that you encounter.

There is a very easy way to live-reload changes to make development trivial.

1. Execute `nx serve tmlang-maker`

2. Make changes to the existing YAML file

3. Save changes

4. A new`idl.tmLanguage` XML file will automatically be generated

5. Start or refresh your debug session of IDL to pick up the changes and see if it worked

> Do make sure to commit changes to the `idl.tmLanguage` file!

6. Update the automated tests with `npm run generate-tests` and verify any changes are correct or good enough. They don't need to be perfect.

## Building

The `idl.tmLanguage` file is automatically built as part of the extension build process, meaning there is nothing additional that you need to do.

> Do make sure to commit changes to the `idl.tmLanguage` file!

## Quick Tips and Tricks

- All token groups (with `begin` and `end`) have a scope applied to them. This helps dramatically with debugging to understand the syntax tree using the developer tool "Developer: Inspect Editor Tokens and Scopes" and can call out why a specific token is or is not highlighted.

- Definition groups in the YAML file mostly follow the pattern established in `libs/parsing/tokenizer/src/lib/tokens/def-groups.interface.ts`

- Regular expression starting points match what was used for the tokenizer in `libs/parsing/tokenizer/src/lib/tokens/defs`

- Here's a helpful guide to follow for token naming conventions: https://macromates.com/manual/en/language_grammars#naming_conventions

- Don't worry about case sensitivity as the build process automatically adds case insensitive regex flags if a non-escaped letter character is present.

- Use variables to simplify and share regular expressions for closing statements

  > Pro tip: Currently there is no support for variable replacement within the variables themselves.

  To dso this, use the syntax `{{variable_name}}` where the variable is defined at the top of the file in the `variables` tag. This tag is deleted before saving the final tmLanguage file, so they are limited to the YAML file

- If you are new to tmLanguage files, see the many examples implemented to follow the same pattern and style

- Be cautious when using look-arounds in your expressions (i.e. `(?<!)` or `(!<=)`). They can easily grab too much context and do not operate in the same way as the internal tokenizer which is much more forgiving.

- Some tokens which you might expect to be highlighted, but are not, could be because another token has a match before.

  > Pro tip: For any confusion with procedures, such as the block regular expression, there was a need to add `\s*` to the front of the start and end so it would come before procedures.

- Use the syntax `<<` for tag names to merge properties on-to the current object. For example:

  ```yaml
  # blocks of IDL code
  block:
    name: '{{group_block}}' # quotes not needed, but format on save formats and changes appearance without
    begin: '\s*\bbegin\b'
    beginCaptures:
      '0': { name: '{{name_control}}' } # quotes not needed, but format on save formats and changes appearance without
    end: '\s*({{block_end}})'
    endCaptures:
      '0': { name: '{{name_control}}' } # quotes not needed, but format on save formats and changes appearance without
    patterns:
      - include: '#default_tokens'

  # blocks of IDL code in loops
  block_loop:
    patterns:
      - include: '#control_continue'
      - include: '#control_break'
    <<: block

  # blocks of IDL code in logic statements
  block_logic:
    <<: block_loop
  ```

  Note that you can only "recurse" like the above example if you build from the top of the file to the bottom
