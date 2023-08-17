// https://developer.mozilla.org/en-US/docs/Glossary/Base64
export function base64ToBytes(base64: string) {
  const binString = atob(base64);
  return Uint8Array.from(binString, (m) => m.codePointAt(0) as number);
}
