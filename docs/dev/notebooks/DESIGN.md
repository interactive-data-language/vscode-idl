# Notebook Design

This doc covers the basics of notebook design and how all the pieces come together.

For more information about the basic concepts in VSCode, see [here](https://code.visualstudio.com/api/extension-guides/notebook).

## Basics

Notebooks have a fair number of key features that tie together to make everything work.

This covers, at a high level, the parts/pieces and what they do and how they come together.

- Notebook Serializer: `libs/vscode/notebooks/src/lib/serializer/idl-notebook-serializer.class.ts`

  Loads notebooks from disks and converts our JSON schema into a format that VSCode expects

  Saves notebooks to disk and converts from the VSCode format to our JSON schema

- Notebook Controller: `libs/vscode/notebooks/src/lib/controller/idl-notebook-controller.class.ts`

  Manages cell execution

  Starts IDL if not already

  Takes output from IDL and turns it into cell output for VSCode

- Notebook Renderer main entry point: `apps/notebook/renderer/src/main.ts`

  This sets up a renderer for notebook outputs per the VSCode renderer guidelines

  Renderers are JS + HTML based offering lots of potential create interactive content!

  This imports our web components from disk (only JS) and sets the basic HTML that needs to be rendered

  Also sets a global variable (on window) that allows for our web components to send messages back and forth

- Actual components that create web content: `apps/notebook/components`

  We use Angular to create web components and bundle everything together.

  The main component is the `EntryComponent` that is registered as a web component

  The bootstrap (develop) or web component registry process happens in `apps/notebook/components/src/app/app.module.ts`

- Messages to/from main VSCode process.

  Messages from the web components are centralized in: `apps/notebook/components/src/app/services/vscode-renderer-messenger.service.ts`

  The variable used in the service comes from: `apps/notebook/renderer/src/main.ts`

  Message handler within our extension client happens in: `libs/vscode/notebooks/src/lib/renderer-messenger/handle-renderer-message.ts`

- IDLNotebook class which collects information during notebook cell execution: `idl/vscode/notebooks/idlnotebook__define.pro`

  This uses IDL structures as the basis for messages that get exported from IDL so that everything is strictly typed

  The typescript version of these structures can be found in: `libs/notebooks/types/src/lib/idl-notebook-embedded.interface.ts`
