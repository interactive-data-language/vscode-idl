# To-Do Lists: Keeping LLMs on Track

One of the most helpful capabilities that GitHub Copilot has access to is to-do lists. To-do lists not only help you see what the LLM has to do, but it also offers an easy way to keep an LLM on track.

Whenever possible, it is recommended to express your requests to the LLM as a list of steps and, for heavy processing, to explicitly call out "create a to-do list."

Here's an example of how you can do this with IDL or ENVI:

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
