/**
 * Capitalizes a word. For use with making nice-reading headers
 */
export function CapitalizeWord(word: string) {
  if (word.length === 0) {
    return 'Documentation';
  } else {
    return `${word.substring(0, 1).toUpperCase()}${word.substring(1)}`;
  }
}
