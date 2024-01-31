import { EXTENSION_DOCS_URL } from '@idl/shared';

import { IDL_CLIENT_CONFIG } from './track-workspace-config';

/**
 * Using extension settings, gets a URL for problem codes
 */
export function ResolveExtensionDocsURL(baseUrl: string) {
  return `${
    IDL_CLIENT_CONFIG.documentation.useOnline
      ? EXTENSION_DOCS_URL
      : `http://localhost:${IDL_CLIENT_CONFIG.documentation.localPort}`
  }${baseUrl}`;
}
