/**
 * Takes a string and adds spaces into the regular expression so we
 * properly handle output
 */
export function SpacifyRegex(content: string) {
  const output: string[] = [];
  for (let i = 0; i < content.length; i++) {
    // only save non-space characters
    if (content[i] !== ' ') {
      output.push(`${content[i]}\\s*`);
    }
  }
  return output.join('');
}
