/**
 * Makes a string representing spaces for use with indentation
 */
export function MakeSpaces(n: number): string {
  if (n <= 0) {
    return '';
  }
  return new Array(n).fill(' ').join('');
}
