# Exporting Docs

This covers the high-level design for being able to export docs.

## Basic Logic

Export will follow this logic:

1. Find all PRO files in given workspace that you want to export

2. Based on the export folder, export files in the following pattern (source markdown files will always be lower case):

- Functions go to `/api/func/name.md`

- Procedures go to `/api/pro/name.md`

- Structures (not classes) go to `/api/struct/name.md`

- Classes go to `/api/class/name.md`

- Procedure methods go to `/api/class/pro/method.md`

- Function methods go to `/api/class/func/method.md`

- ENVI Tasks go to: `/api/tasks/envi/name.md`

- IDL Tasks go to: `/api/tasks/idl/name.md`

3. For each folder, automatically create an alphabetized list of the content that is present

4. Apply the :Private: tags are routine levels

- TODO: Figure out how to add them at file levels to hide entire files

5. Create links for documentation:

- Arguments, within named files above, follow `arg-0` where `0` is the zero-based index of the argument

- Keywords, within names files above, will follow `kw-name` where `name` is the lower-case name of the keyword

- Properties, within files above, will follow `prop-name` where `name` is the lower-case name of the keyword

## Other Docs

Following an export for vitepress, this is a nice, clean approach that separates the APi documentation from examples and other helper code for your docs page.

Basically we will be set up to have an "API" header item that jumps to the API docs and keeps the users focused on the other useful content (like examples, etc) in other docs.

It also secures the "routes" for API to be the pattern moving forward.

We can then use the vitepress patterns to link to a routine definition from anywhere using the docs structure and link patterns from above.
