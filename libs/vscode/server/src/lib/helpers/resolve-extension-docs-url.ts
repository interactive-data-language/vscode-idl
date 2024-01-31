import { IDL_CLIENT_CONFIG } from './track-workspace-config';

/**
 * Using extension settings, gets a URL for problem codes
 */
export function ResolveExtensionDocsURL(baseUrl: string) {
  return `${
    IDL_CLIENT_CONFIG.documentation.useOnline
      ? 'https://interactive-data-language.github.io/vscode-idl'
      : `http://localhost:${IDL_CLIENT_CONFIG.documentation.localPort}`
  }${baseUrl}`;
}
