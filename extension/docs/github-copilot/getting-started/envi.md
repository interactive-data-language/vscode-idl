# Quick Start: ENVI

## Key Takeaways

ENVI's GitHub Copilot integration uses specialized MCP tools to run processing workflows, understand datasets, and solve remote sensing problems using expert approaches.

**Requirements:**

- IDL 9.2 and ENVI 6.2 or newer
- ENVI Agent license feature
- Works alongside IDL Agent capabilities

**Key Difference:** ENVI uses a guided "happy path" approach with dedicated tools, unlike IDL's open-ended programming focus.

## How It Works

ENVI's integration centers on specialized MCP tools that enable GitHub Copilot to run ENVI processing, understand your datasets, and chain together workflows. This differs from the IDL integration—instead of open-ended programming, we guide the LLM through proven approaches using ENVI's established toolset.

## What You Can Do

**List and Run Tools**

Run any ENVI tool, including custom tools from the Analytics Repository, IDL's search path, or ENVI's custom code folder.

**Query Datasets**

Learn about rasters, vectors, machine learning models, deep learning models, and more.

**Open and Display Data**

View rasters, vectors, and raster series datasets directly in ENVI.

**Create Workflow Artifacts**

Generate IDL routines and IDL Notebooks for repeatable workflows.

## Example Prompts

Guide GitHub Copilot to use ENVI by adding phrases like "Using ENVI", "With ENVI", or "Can ENVI" to your requests.

Here are some examples to get started:

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

### Working with ENVI's Tools

**Built-in Prompts:** Start your chat with "/envi" to access pre-configured prompts designed for common remote sensing problems. These provide ready-to-use templates you can copy and customize.

Here are additional examples for exploring ENVI's capabilities:

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

## Helpful Tips

**Automatic Startup:** ENVI and IDL start automatically when needed—no manual intervention required.

**Built-in Prompts:** Start your chat with "/envi" to access pre-configured prompts designed for common remote sensing problems.

**Multi-File Data Sources:** For complex formats like Sentinel 2 or PlanetScope, provide the direct path to the root metadata file (e.g., "metadata.xml" for Sentinel 2 or "\_metadata.json" for Planet data). This ensures GitHub Copilot opens the correct dataset.

**Understanding Data:** Ask GitHub Copilot to query or describe datasets when you need more information. This works for all data types, including complex multi-file formats.
