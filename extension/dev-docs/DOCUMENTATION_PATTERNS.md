# Documentation Patterns

Captures key logic for exporting documentation for a VSCode workspace as Markdown.

## General Structure

"root" is the folder that all docs go to, this is `extension/docs` for the extension

- `api` is the holder of all of our docs

  - `class` contains class definitions (i.e. summaries) for structures and classes

    - `class/func` contains class function methods by name `class__method`

    - `class/pro` contains class procedure methods by name `class__method`

  - `func` contains all functions by lower-case name

  - `pro` contains all procedures, by lower-case name

  - `task` contains all tasks

    - `task/envi` contains ENVI Tasks by lower-case task name

    - `task/idl` contains IDL Tasks by lower-case task name

## Linking to Other Routines

With the pattern outlined above, its very easy to craft links between your docs to different routines.

For example:

- To link to a function called, `plot` you make a Markdown link with the value `/api/func/plot.html`

- To ling to the class summary for `myclass` you make a Markdown link with the value `/api/class/myclass.html`
