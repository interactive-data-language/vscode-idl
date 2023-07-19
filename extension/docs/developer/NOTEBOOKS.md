# Notebooks!

This doc covers some of the background and design for implementing notebooks as part of the extension.

At a high level, a lot of work/code is re-used which made it very easy to integrate into the language server.

Here's a helpful document for background information:

https://code.visualstudio.com/api/extension-guides/notebook

## Code

Here are the major locations for code and the logic regarding notebooks. If you pop into one of these entry points and do a ctrl + click then you can navigate through and follow logic:

0. Notebook configuration: `apps/package-json/src/contributes/notebooks.ts`

1. Main VSCode entry point: `libs/vscode/notebooks`

2. Shared types: `libs/notebooks`

3. Language server events:

- Registration from VSCode to use language server: `libs/vscode/notebooks/src/lib/providers`

- Language server methods (same code paths for PRO files): `libs/vscode/server/src/lib/user-interaction/events`

- Language server notebook open/change events: `libs/vscode/server/src/lib/file-management/notebooks`

## Key Concept: Notebook Serializer

The first part of a notebook is the file format.

For us, that means we need to make a serializer for the notebook file which is up to us to write.

For now, we use a modified version of the tutorial serializer that VSCode walks through and you can find the source code here:

`libs\vscode\notebooks\src\lib\serializer\idl-notebook-serializer.interface.ts`

At a high level, the serializer does two things:

1. Is fed content from VSCode regarding notebook cells to write to disk where we get a full notebook document

2. Is also called when we have a notebook file that we need to restore from disk.

Our notebook serializer converts to JSON and writes that directly to disk. We do this for performance as we can have large notebooks and it take a very small amount of time to serialize/restore.

## Key Concept: Notebook Controller

This is analogous to the Kernel in Jupyter. It manages execution of notebook cells, capturing output, and rendering images or anything else we need.

We are fairly basic with our controller, with the exception that we followed the pattern from the jupyter kernel to graph images and embed them within the notebook.

> Pro tip: You can view our notebook configuration which controls the tools displayed in the toolbar when you have a notebook open.

We copy/pasted a small bit of code from our debug adapter for listening to events and mapped those to adding outputs within notebook cells. This means that we use the same class for interacting with IDL behind the scenes.

## Notebook User Interactions

In order for things like hover-help and auto-complete to work with notebooks, we have to register our own providers (VSCode term) in order for it to work.

We do that with the files in here: `libs/vscode/notebooks/src/lib/providers`

This has some special sauce that takes the URIs from VSCode, maps them to how we understand them (covered in the next section), uses the standard language server events, and converts the responses into a format that VSCode accepts.

## Key Concept: Notebook Document in Language Server

Notebooks are special documents in VSCode and they are structured a bit differently.

Here's a JSON representation to give a better idea:

```json
{
  "uri": "file:///c%3A/Users/znorman/Documents/node/vscode-idl/idl/test/scratch/notebooks/test.idlnb",
  "notebookType": "idl-notebook",
  "version": 0,
  "cells": [
    {
      "kind": 1,
      "document": "vscode-notebook-cell:/c%3A/Users/znorman/Documents/node/vscode-idl/idl/test/scratch/notebooks/test.idlnb#W0sZmlsZQ%3D%3D"
    },
    {
      "kind": 2,
      "document": "vscode-notebook-cell:/c%3A/Users/znorman/Documents/node/vscode-idl/idl/test/scratch/notebooks/test.idlnb#W1sZmlsZQ%3D%3D"
    },
    {
      "kind": 2,
      "document": "vscode-notebook-cell:/c%3A/Users/znorman/Documents/node/vscode-idl/idl/test/scratch/notebooks/test.idlnb#W2sZmlsZQ%3D%3D"
    },
    {
      "kind": 2,
      "document": "vscode-notebook-cell:/c%3A/Users/znorman/Documents/node/vscode-idl/idl/test/scratch/notebooks/test.idlnb#W3sZmlsZQ%3D%3D"
    },
    {
      "kind": 2,
      "document": "vscode-notebook-cell:/c%3A/Users/znorman/Documents/node/vscode-idl/idl/test/scratch/notebooks/test.idlnb#W4sZmlsZQ%3D%3D"
    }
  ]
}
```

If the JSON above looks like spanish, that's OK! The key concept is that we have a URI/reference for each cell. This means that each cell is treated as it's own editor within VSCode.

The "So What" for that is we have to map metrics, hover-help, auto-complete, diagnostics, etc. into one of these notebook cells. The other implication is that we need to have a URI on disk to represent the different cells.

This is where come core changes to the language server come in. We identify a notebook cell as the filepath with a hashtag and zero-based number for the cell:

```typescript
const fsPath = 'C:\\Users\\zach\\mynotebook.idlnb`

const cell1 = `${fsPath}#0`
const cell2 = `${fsPath}#1`
```

That way we can identify/retrieve content for individual notebook cells without needing the whole thing.

The other part of this that keeps things tidy is that we don't automatically parse notebooks on the language server startup. We wait for users to open and interact with them before we do anything.

## Notebooks: File Mappings

In order to have capabilities like go-to-definition and problem reporting work, we have mapping that converts from our format of `/Users/file.notebook#0` to the document URI that VSCode is aware of.

> Note: The mappings to our path scheme from from the different providers (hover, auto-complete) and can be found here:
>
> `libs/vscode/notebooks/src/lib/providers`

That's where this routine comes in: `libs/vscode/server/src/lib/user-interaction/helpers/resolve-fspath-and-code-for-uri.ts`

It takes the URI that we get for a document or cell, maps it to the right thing on disk, and retrieves the code so that it all happens in a centralized location.

We also have a reverse mapping, which takes the path from disk and converts it to the URI that VSCode understands: `libs/vscode/server/src/lib/user-interaction/helpers/uri-from-idl-index-file.ts`

## Parsing Considerations

When we parse files, there are a few special considerations that we take into account:

1. We always have `compile_opt idl2` set at the main level, so we don't need to report errors there.

2. We can access main level program variables from cells above us in cells below

3. We don't need an "end" to main level programs if we only have main level programs.
