/**
 * Clean links for parameters to remove spaces (mostly from docs)
 */
export function CleanParamLink(link: string) {
  return link.replace(/\s|\./g, '-');
}
