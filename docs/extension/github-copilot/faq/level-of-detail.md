# Right Level of Detail

## Key Takeaways

The right level of detail depends on how much flexibility you want the LLM to have. Balance prescriptive instructions with creative freedom based on your goals.

**Prescriptive Approach:** Use when you have a specific way things should be done

**Broad Strokes Approach:** Use when you want the LLM to adapt and make decisions

## Prescriptive Instructions

When you have a specific way you want something accomplished, be explicit in your instructions. This approach works well for:

- Programming tasks (renaming routines, reorganizing code)
- Complex multi-step processes with specific requirements
- Situations where you've said "I didn't want the LLM to do it that way"

Provide detailed steps to ensure the LLM behaves as you expect, saving time by getting the right answer on the first attempt.

**Example:** "Rename all instances of `old_function` to `new_function` in files matching `src/**/*.pro`. Update all calls to use the new name and verify no references to the old name remain."

## Broad Strokes Approach

When you want the LLM to have flexibility in solving a problem, provide high-level goals and let it determine the best approach. This works well for:

- Exploratory data analysis
- Creative problem-solving
- Situations where multiple valid approaches exist
- Tasks where you want the LLM to apply its expertise

The LLM can adapt to unexpected situations and choose optimal methods based on context.

**Example:** "Analyze the image quality in this dataset and suggest preprocessing steps to improve classification results."

## Finding the Balance

Start with broad instructions and add prescriptive details where needed. If the LLM's approach doesn't match your expectations, refine your instructions to be more specific in those areas.
