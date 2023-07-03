/**
 * Create an unique ID for our session that follows the error we got from
 * Google/firebase for 32-character hex numbers
 */
export function MakeID(n = 32) {
  const str = [];
  for (let i = 0; i < n; i++) {
    str.push(Math.floor(Math.random() * 16).toString(16));
  }
  return str.join('');
}
