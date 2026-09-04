import type { ExamplePrompt } from '@idl/types/chat';

/**
 * Returns a random subset of `count` example prompts, without duplicates.
 */
export function GetRandomExamplePrompts(
  prompts: ExamplePrompt[],
  count: number,
): string[] {
  const shuffled = [...prompts].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count).map((prompt) => {
    return Array.isArray(prompt) ? prompt.join('\n\n') : prompt;
  });
}
