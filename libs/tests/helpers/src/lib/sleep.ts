/**
 * Pauses execution for a bit
 */
export async function Sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
