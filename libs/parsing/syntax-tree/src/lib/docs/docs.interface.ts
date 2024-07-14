/** Arguments */
export type ArgsHeader = 'args';
/** Author */
export type AuthorHeader = 'author';
/** Default header for documentation when nothing is explicitly set */
export type DefaultHeader = 'default';
/** Header for examples */
export type ExamplesHeader = 'examples';
/** Header for keywords */
export type KWHeader = 'keywords';
/** If a routine is private */
export type PrivateHeader = 'private';
/** What a routine returns */
export type ReturnsHeader = 'returns';
/** Revision history */
export type RevisionsHeader = 'revisions';
/** Header containing the tooltip for display in web version of docs */
export type TooltipHeader = 'tooltip';

/** Union type pf all allowed headers */
export type IDLDocsHeaders =
  | ArgsHeader
  | AuthorHeader
  | DefaultHeader
  | ExamplesHeader
  | KWHeader
  | ReturnsHeader
  | RevisionsHeader;

/**
 * Strictly types headers
 */
export interface IDocHeaderLookup {
  /** Arguments */
  ARGS: ArgsHeader;
  /** Author */
  AUTHOR: AuthorHeader;
  /** Default header for documentation when nothing is explicitly set */
  DEFAULT: DefaultHeader;
  /** Example docs */
  EXAMPLES: ExamplesHeader;
  /** Header for keywords */
  KEYWORDS: KWHeader;
  /** If a routine is private */
  PRIVATE: PrivateHeader;
  /** What a routine returns */
  RETURNS: ReturnsHeader;
  /** Revision history */
  REVISIONS: RevisionsHeader;
  /** Header containing the tooltip for display in web version of docs */
  TOOLTIP: TooltipHeader;
}

/**
 * Lookup for headers that we might find in documentation. These should be the standard tags
 * used, but below we have a map to convert other tags that people might use to
 * the right name we expect internally
 */
export const IDL_DOCS_HEADERS: IDocHeaderLookup = {
  ARGS: 'args',
  AUTHOR: 'author',
  DEFAULT: 'default',
  EXAMPLES: 'examples',
  KEYWORDS: 'keywords',
  PRIVATE: 'private',
  RETURNS: 'returns',
  REVISIONS: 'revisions',
  TOOLTIP: 'tooltip',
};
