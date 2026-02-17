# Right Level of Detail

In general, you want to make sure that an LLM has the right level of detail for how you want a problem to be solved. _How_ in this case refers to the amount of flexibility for reasoning and on-the-fly decision making vs a very strict path that hte LLM should follow.

There's two lines of thought:

1. Prescriptive with exact steps

2. Broad Strokes and the LLM can Adapt

## Prescriptive

::: tip
If you find yourself saying "I didn't want the LLM to do it that way" then you probably want to give more exact instructions.
:::

Typically, when you have a specific way you want something done, you should be explicit in what you tell the LLM.

This often works well with programming tasks (such as renaming routines, reorganizing code).

Also works well with other complex, multi-step processes. We recommend writing everything down that you want to happen so that the LLM behaves as you expect and then you save time by getting the right answer the first time.

## Broad Strokes
