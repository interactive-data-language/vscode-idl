# To-Do Lists: Keeping LLMs on Track

## Key Takeaways

To-do lists help keep GitHub Copilot organized and give you visibility into its progress. Structure your requests as numbered steps and ask for the LLM to create a to-do list to make sure all actions are done as instructed.

**Benefits:**

- Clear visibility into what the LLM plans to do
- Easy tracking of progress on complex tasks
- Better organization for multi-step workflows

**Best Practice:** Express requests as numbered lists, especially for complex tasks

## Why To-Do Lists Matter

GitHub Copilot has access to a to-do list tool that provides structure for complex tasks. When you express your request as a list of steps, the LLM can create an organized plan and work through each item systematically. We also recommend, for workflows that have many actions, that you explicitly ask the LLM to create a to-do list.

This approach is particularly valuable for:

- Multi-file operations
- Complex ENVI workflows
- Tasks that require multiple tools or steps
- Situations where you want clear progress updates

## Example Requests

Here's how to structure your requests to take advantage of to-do lists:

::: code-group

```[IDL]
I need help updating syntax in some files.

1. Search "here" for files patching "routine\*.pro"
2. Create a to-do list for each file you find and:
- Update routine name to match "newroutine\*.pro"
- Find references to old routine name being used
- Update new procedure calls to match "newroutine\*"
```

```[ENVI]
I need you to automatically run change detection against some images I have

1. Search for pre-event images in "here" and post-event images in "here"
2. Query each image with ENVI and pair datasets based on name/extent/location
3. Create a to-do list with items for each pair of image to do the following processing with ENVI:
- Calculate NDVI for each image in the pair
- Get the image intersection between the datasets
- Apply a change threshold to highlight changes about +/- 0.2
- Run classification smoothing with a kernel size of 10 to help de-speckle results
4. Run each step of processing, put results in "here"
```

:::
