/**
 * Does a strict check to compare the raw text for a tool name
 * and the docs for a tool
 *
 * Used to tell if a tool "My tool" has docs that say "My tool"
 * which don't tell us anything
 */
export function StrictCheck(name: string, docs: string) {
  return (
    name.replace(/\s|_|-/gim, '').toLowerCase() ===
    docs.replace(/\s|_|-/gim, '').toLowerCase()
  );
}
