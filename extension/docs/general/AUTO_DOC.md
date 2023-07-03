# AutoDoc

The AutoDoc feature of the extension automatically creates and maintains documentation for your routines and keeps them up-to-date with the latest arguments and keywords in your code.

> You need to opt-in in order to take advantage of the AutoDoc feature.

> If your code comments are not in the IDL Doc format, then you most likely don't want to use AutoDoc or you should test it out beforehand.

> In order for comments to be identified, they MUST BE BEFORE routine definitions. We don't support the syntax of adding docs after the routine name.

## Features

AutoDoc has two main groups of features and things that it does:

1. Normalizes comments to always use the same styling and formatting. This makes sure that, no matter who writes the comments, they will have the same look and feel.

2. Automatically adjusts comments based on procedure/function and adds any missing parameters (arguments or keywords) to the docs without the extra step of manually including them. It completely automates this process so you can spend more time writing code instead of documenting it.

## Formatting Style

There are three components to the formatting of routine comments: section order adn indentation style.

### Header Sections: Order and Aliases

And here is a table with the order that docs section tags are processed.

> Pro tip: The pattern for section names is that they are a single word

> Header sections are case insensitive, but are formatted with first letter upper-case and the rest lower case

> Need more aliases? let us know! It's easy to add new ones.

| Section          | Description                         | Aliases (case insensitive)    |
| ---------------- | ----------------------------------- | ----------------------------- |
| Private          | None                                |                               |
| Tooltip          | Placeholder                         |                               |
| Description      | Routine overview, includes examples | "About"                       |
| Returns          | Returned data type                  |                               |
| Arguments        | Details on each argument            | "Param", "Parameters", "Args" |
| Keywords         | Details on each keyword             |                               |
| Any user headers | Whatever you want!                  |                               |
| Author           | Who wrote it                        |                               |
| Revisions        | Changes over time                   | "History"                     |

### Indentation and Spacing

Here's a sample formatted comment block as a reference:

```idl
;+
; :Description:
;   My procedure
;
; :Arguments:
;   var1: in, required, any
;     My favorite thing
;
; :Keywords:
;   kw1: in, optional, boolean
;     Super Cool flag
;
;-
pro myRoutine, var1, kw1 = kw1
  compile_opt idl2
  ; ......
end
```

Here's the important details:

- All primary headers have one space between the comment and the header start (i.e. `; :Description:`)

- The content for each header _always_ starts on the next line

- Each level of content is automatically indented by two spaces. This is non-configurable and does not respect the number of spaces used for formatting

- For arguments and keywords, the docs style follows: `name: direction, required, type` and is based on the IDL Doc formatting style

- Within VSCode, you can hover over the `direction, required, type` and hover help will provide additional detail on what those parameters are.

- Any descriptions of the parameters have an additional two spaces of indentation

- After each section, a space is created to delineate between sections
