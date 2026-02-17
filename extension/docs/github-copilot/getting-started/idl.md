# Quick Start: IDL

::: info

- Requires IDL 9.2 or newer

- Root-level instructions are registered for IDL and IDL Notebooks

- They are applied automatically when you have IDL code or IDL Notebooks open or attached to chats

- You'll see "GitHub Copilot: IDL" printed in your chat when these instructions load

:::

## Background

Because GitHub Copilot is an expert programmer, we decided to provide instructions to help GitHub Copilot be better at writing IDL code and to do our best to have these instructions automatically applied.

## Sample Questions

Because GitHub Copilot is an expert programmer, and has many tools available to it, the sky is the limit with what kinds of questions you can ask and have answered.

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

## Tips and Tricks

::: info
ENVI and IDL will automatically start for you when a tool requires it. You don't need to manually start IDL or ENVI.
:::

::: tip
When creating a notebook for IDL, you should explicitly ask for an "IDL Notebook". This makes sure a native IDL Notebook is created and not a Python/Jupyter notebook.

There's dedicated support for IDL Notebooks native to VSCode which does not require any additional setup or configuration.
:::

## Attaching Context

::: info
Select the paperclip icon in your chat to explore what you can attach to a conversation to add context about code.
:::

One very helpful aspect of GitHub Copilot is that you can attach a variety of sources to the chat to help the LLM have context and better answer questions for you.

Examples:

- Highlight a block of code in an open editor and ask the LLM about it (automatically attached)

- Attach multiple PRO files and ask the LLM to explain the code or make changes between the two files
