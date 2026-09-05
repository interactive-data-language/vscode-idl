# Quick Start: ENVI Agent

ENVI Agent is a partner for building and running geospatial processing workflows, enabling you to focus on intent and results rather than managing manual mechanics.

ENVI Agent works by providing a set of Model Context Protocol (MCP) tools and instructions for GitHub Copilot.

## Setup

::: info

ENVI Agent setup is the same as IDL Agent, but requires ENVI + IDL

:::

<div  align="center" style="margin-bottom:2rem;margin-top:2rem;">
  <video controls style="max-width: 1920px; width: 100%">
    <source src="https://vis-mktg.s3.us-east-1.amazonaws.com/web-content/vscode-idl/envi-agent-setup.mp4" type="video/mp4">
  </video>
</div>

**Requirements:**

- Install [ENVI 6.2](https://portal.nv5geospatialsoftware.com/) and have the ENVI Agent license feature

- [Install Visual Studio Code](https://code.visualstudio.com/download) or update to the latest version

- Install [IDL for VSCode](https://marketplace.visualstudio.com/items?itemName=IDL.idl-for-vscode)

- A paid [GitHub Copilot](https://github.com/features/copilot/plans) account

## Helpful Tips

::: tip

To guide the LLM to use ENVI, make sure to add "ENVI" to your requests. Here's some examples:

- Using ENVI can you do [awesome remote sensing workflow]
- Can you [insert request] with ENVI?

:::

**Automatic Startup:** ENVI and IDL start automatically when needed, no manual intervention required.

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

For ENVI, make sure to include text like "Using ENVI", "With ENVI", or "Can ENVI" to your requests.

Here's some requests for what kinds of questions IDL Agent can help with:

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
