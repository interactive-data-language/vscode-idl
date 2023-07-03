/**
 * Scheme to access and use everywhere for IDL's help schema.
 */
export const IDL_HELP_SCHEME = 'idl-help';

/**
 * Options for displaying help content from IDL in VSCode
 */
export interface IDLHelpOptions {
  /** Markdown strings to display */
  help: string;
  /** URL to official docs for quick access */
  link?: string;
}
