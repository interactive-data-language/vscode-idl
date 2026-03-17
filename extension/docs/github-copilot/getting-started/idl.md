# Quick Start: IDL Agent

IDL Agent empowers you to autonomously write, run, and troubleshoot IDL code, simplifying developer workflows and accelerating discovery.

IDL Agent works by providing a set of Model Context Protocol (MCP) tools and instructions for GitHub Copilot.

## Setup

::: info

IDL Agent setup is the same as ENVI Agent.

:::

<div  align="center" style="margin-bottom:2rem;margin-top:2rem;">
  <video controls style="max-width: 1920px; width: 100%">
    <source src="https://vis-mktg.s3.us-east-1.amazonaws.com/web-content/vscode-idl/idl-agent-setup.mp4" type="video/mp4">
  </video>
</div>

**Requirements:**

- Install [IDL 9.2 or ENVI 6.2](https://portal.nv5geospatialsoftware.com/)

- [Install Visual Studio Code](https://code.visualstudio.com/download) or update to the latest version

- Install [IDL for VSCode](https://marketplace.visualstudio.com/items?itemName=IDL.idl-for-vscode)

- A paid [GitHub Copilot](https://github.com/features/copilot/plans) account

## Helpful Tips

**Automatic Startup:** IDL starts automatically when needed, no manual intervention required.

**Creating IDL Notebooks:** Explicitly request an "IDL Notebook" to ensure you get the native VSCode implementation rather than a Python/Jupyter notebook. Native IDL Notebooks require no additional setup or configuration.

## Example Questions

Here's some requests for what kinds of questions IDL Agent can help with:

::: code-group

```[Run code snippet]
Can you execute this IDL code for me?

print, 'Hello world!'
```

```[Docs Help]
Can you tell me more about the HTTPRequest class in IDL?
```

```[Create Notebook]
Can you create an IDL Notebook for me?

I would like it to create and plot sinusoidal data.
```

```[Writing Code]
Can you write an IDL routine for me that performs non-maxima-suppression?

I would like it to be a function and have a vectorized/optimized approach
that goes through the bounding boxes one time (so it is more linear for performance)
```

:::

## Attaching Context

GitHub Copilot can incorporate various sources to better understand your code and provide more relevant answers. Click the paperclip icon in your chat to explore available options.

**Ways to Add Context:**

- Highlight code in an editor, it attaches automatically
- Attach multiple PRO files to explain or compare code
- Reference specific files or folders for targeted assistance
