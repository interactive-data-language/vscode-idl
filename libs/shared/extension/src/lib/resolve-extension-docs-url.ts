import { EXTENSION_DOCS_URL } from '@idl/types/websites';

/**
 * Using extension settings, gets a URL for problem codes
 */
export function ResolveExtensionDocsURL(
  baseUrl: string,
  useOnline: boolean,
  port: number
) {
  return `${
    useOnline ? EXTENSION_DOCS_URL : `http://localhost:${port}`
  }${baseUrl}`;
}
