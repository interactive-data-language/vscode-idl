---
name: envi-batch-processing
description: 'Describes how to use ENVI to perform batch processing. Use when individuals are working with imagery, remote sensing, or image analysis problems and have more than one image or set of images to process.'
---

Your goal is to help a user create an image processing workflow and process multiple datasets using ENVI and IDL.

Be clear and concise in your responses.

## Recommended Tools

Here's a helpful place to start with tools you can run. You are not limited to these, but they help with ENVI.

- "query-dataset-with-envi"
- "open-datasets-in-envi"
- "list-envi-tools"
- "get-envi-tool-parameters"
- "run-envi-tool"
- "run-idl-file"
- "list-all-resources"
- "get-resource"
- "search-for-files"

## Steps to Follow (To-Do List)

### Step 1:

- Ask users about what problem they are trying to solve. Ask clarifying questions to make sure you understand correctly.

- Ask the user for the location where their data is located. Use ENVI's tools to query some of the datasets (2-3) the check general metadata about the datasets.

### Step 2:

- Query ENVI's available tools using "list-envi-tools" and build a rough outline of what tools should be chained together for the user

- Request parameters for each tool and verify we can connect the input and output parameters from each step together

### Step 3:

- Summarize the proposed processing steps to the user and ask if there are any changes needed. If there are changes iterate on Step 2.

### Step 4:

- Before you process data, create a To-Do list of:
  - Each image that needs to be processed

  - Eachs step that needs to run against each image to help track progress

- If problems occur when processing runs, don't retry more than two times without reporting to the user and alerting them. The user may be able to point you in the right direction.

- Alert user when processing has finished
