# Known Issues

This document covers some of the known issues with the extension and how to work around them.

## Notebooks

- **Unable to resolve text model content** when viewing cell outputs in text editor

  If you try to view the output from a notebook cell in a text editor, and see an error along the lines of "unable to resolve text editor content", you'll need to enable scrolling to view the content.

  There's an issue in VSCode where, when you have this error, you can't view the cell output in it's entirety nor can you automatically turn it into a scrollable area.

  To display this output, it is recommended to turn on the setting "Notebook: Output Scrolling" so you can easily view everything that a notebook cell generates. If you do change this, you'll need to re-run the cell for the changes to take effect.
