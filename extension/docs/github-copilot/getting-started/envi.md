# Quick Start: ENVI

::: info

- Requires IDL 9.2 and ENVI 6.2 or newer and the ENVI Agent license feature

- ENVI's integration with GitHub Copilot is focused on dedicated MCP tools to drive ENVI and provide the LLM with additional context to solve remote sensing problems

- You can also have GitHub Copilot write IDL code for you using IDL and the ENVI API

:::

## Background

Unlike IDL, ENVI's integration with GitHub Copilot is focused on a set of dedicated MCP tools that allow the LLM to run processing in ENVI, understand your datasets, and find additional examples of how ENVI's processing tools can be chained together.

The distinct difference is that we have a "happy path" we guide the LLM down. This is a fundamentally different approach than open-ended programming questions because we have a fixed number of tools that you can run in ENVI.

## High-level Capabilities

- List and run ENVI's tools for you

  Includes any custom tools that have been installed in ENVI through the Analytics Repository, on IDL's search path, or in ENVI's custom code folder.

- Query datasets to learn more about them.

  Supports raster, vector, machine learning models, deep learning models, and more

- Open and display data in ENVI.

  Supports raster, vectors, and raster series datasets.

- Create workflow artifacts such as IDL routines and IDL Notebooks

## Example Questions

::: tip
To guide the LLM towards using ENVI, add text like "Using ENVI", "With ENVI", or "Can ENVI" to your requests.
:::

Here are some basic questions that you can ask the LLM for help with.

::: code-group

```[Open Datasets]
Can you open the ENVI file that lives "here" for me?
```

```[Query Datasets]
Can you tell me about the NITF file in "this" folder?
```

```[Plan and Run Workflows]
/envi Can you help me plan a workflow to detect change detection
using the data "here"?
```

```[Run Specific Tool]
Can you process "this" image with ISODataClassification using ENVI
and display the results?
```

:::

### Example Questions: ENVI's Tools

::: tip
We include a few prompts for ENVI (sets of instructions for solving remote sensing problems).

You can find them my starting your chat with "/envi" which will show a list that you can pick from.

Some of the examples below include the prompt used which you can copy/paste.
:::

Here's some additional examples of how you can learn about ENVI's tools.

::: code-group

```[Tool Questions]
Does ENVI have any tools for classification cleanup?
```

```[Planning #1]
Can you help me come up with a change detection workflow using
spectral indices with ENVI?

I have imagery located in "this" folder that I want to use.

I just want to plan a processing workflow, not run anything.
```

```[Planning #2]
/envi Can you help me detect change between two images using
machine learning?
```

```[Workflows]
Do you know any change detection workflows using ENVI?
```

```[IDL Notebooks]
/envi Help me come up with a data preparation workflow for the
sample data "here".

I don't want the processing to happen, instead please create
an IDL Notebook that I can then customize based on
other data sources.
```

:::

## Tips and Tricks

::: info
ENVI and IDL will automatically start for you when a tool requires it. You don't need to manually start IDL or ENVI.
:::

::: tip
If you have multi-file data sources (like Sentinel 2 or PlanetScope), you may need to guide the LLM to use the root metadata file.

For example: Give the direct path to the "metadata.xml" file for Sentinel 2 or the "\_metadata.json" file for Planet data.

This makes sure that the LLM opens the right dataset in ENVI.
:::

::: tip
To help the LLM find the right data, you can always ask it to tell you more about a dataset or query a dataset in ENVI for you.

Same rules apply to complex file formats listed above.
:::
