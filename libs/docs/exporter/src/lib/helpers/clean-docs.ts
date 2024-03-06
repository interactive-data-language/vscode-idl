/**
 * Escapes characters in docs so we can build
 */
export function CleanDocs(docs: string) {
  return docs.replace(/</g, '\\<');
}
