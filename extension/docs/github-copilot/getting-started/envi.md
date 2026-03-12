# Quick Start: ENVI

## Key Takeaways

ENVI's GitHub Copilot integration uses specialized MCP tools to run processing workflows, understand datasets, and solve remote sensing problems.

**Requirements:**

- IDL 9.2 and ENVI 6.2 or newer
- ENVI Agent license feature
- Works alongside IDL Agent capabilities

## Helpful Tips

::: tip

To guide the LLM to use ENVI, make sure to add "ENVI" to your requests. Here's some examples:

- Using ENVI can you do [awesome remote sensing workflow]
- Can you [insert request] with ENVI?

:::

**Automatic Startup:** ENVI and IDL start automatically when needed—no manual intervention required.

**Built-in Prompts:** Start your chat with "/envi" to access pre-configured prompts designed for common remote sensing problems.

**Multi-File Data Sources:** For complex formats like Sentinel 2 or PlanetScope, provide the direct path to the root metadata file (e.g., "metadata.xml" for Sentinel 2 or "\_metadata.json" for Planet data). This ensures GitHub Copilot opens the correct dataset.

**Understanding Data:** Ask GitHub Copilot to query or describe datasets when you need more information. This works for all data types, including complex multi-file formats.

## What You Can Do

**List and Run Tools**

Run any ENVI tool, including custom tools from the Analytics Repository, IDL's search path, or ENVI's custom code folder.

**Query Datasets**

Learn about rasters, vectors, machine learning models, deep learning models, and more.

**Open and Display Data**

View rasters, vectors, and raster series datasets directly in ENVI.

**Create Workflow Artifacts**

Generate IDL routines and IDL Notebooks for repeatable workflows.

## Example Requests

Guide GitHub Copilot to use ENVI by adding phrases like "Using ENVI", "With ENVI", or "Can ENVI" to your requests.

Here are some examples to get started:

::: code-group

```[Open Datasets]
Can you open the data in "here" for me in ENVI?
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
