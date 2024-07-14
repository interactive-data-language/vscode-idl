import { EXTENSION_DOCS_URL } from '@idl/types/websites';
import { IDLExtensionConfig } from '@idl/vscode/extension-config';

/**
 * Using extension settings, gets a URL for problem codes
 */
export function ResolveExtensionDocsURL(
  baseUrl: string,
  config: IDLExtensionConfig
) {
  return `${
    config.documentation.useOnline
      ? EXTENSION_DOCS_URL
      : `http://localhost:${config.documentation.localPort}`
  }${baseUrl}`;
}
