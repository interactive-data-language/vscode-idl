# Quick Start: IDL

## Key Takeaways

IDL's GitHub Copilot integration enables GitHub Copilot to become an expert IDL programmer through specialized root-level instructions. These instructions are automatically applied when you work with IDL code or IDL Notebooks.

**Requirements:**

- IDL 9.2 or newer
- Instructions automatically load when IDL code or notebooks are open or attached

**What to Look For:** "IDl Agent" message in your chat when instructions load

## Helpful Tips

**Automatic Startup:** IDL starts automatically when needed—no manual intervention required.

**Creating IDL Notebooks:** Explicitly request an "IDL Notebook" to ensure you get the native VSCode implementation rather than a Python/Jupyter notebook. Native IDL Notebooks require no additional setup or configuration.

## How It Works

GitHub Copilot is already an expert programmer across many languages. We've enhanced this expertise with specialized instructions that help it write better IDL code and understand your existing routines. These instructions apply automatically when you work with IDL files or notebooks, no manual setup required.

## Example Requests

GitHub Copilot has access to many tools and can handle a wide range of IDL-related tasks or requests. Here are some examples to get you started:

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
