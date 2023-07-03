# assembling

Libraries related to assembling (i.e. formatting or recreating) code that has been parsed.

## Libraries

- **assembler**: Main entry point for assembling code back together once it has been parsed.
- **config**: Handles restoring/loading/validating config files on disk.
- **fixers**: Code for automatically fixing problems in code.
- **formatters**: Code that manages the mechanical structure and appearance of assembled IDL code.
- **json-formatter**: Logic for how we format JSON for consistent use across the code base
- **load-config**: Manages loading the configuration for Assembling from a file on disk (idl.json).
- **shared**: Code specific to assembling that is shared between our assembling libraries.
- **styles**: The rule sets for styles (only one exists right now).
- **tree-handlers**: Lib to normalize iterating through the syntax tree for style and formatting.
