import { IDL_DOCS_HEADERS } from './docs.interface';

/**
 * Map to convert IDL Docs tags to the internal lookup so they are consistent
 * and allows migrating/accounting for slightly different flavors of docs
 */
export const IDL_HEADER_MAP: { [key: string]: string } = {
  param: IDL_DOCS_HEADERS.ARGS,
  params: IDL_DOCS_HEADERS.ARGS,
  parameters: IDL_DOCS_HEADERS.ARGS,
  arg: IDL_DOCS_HEADERS.ARGS,
  args: IDL_DOCS_HEADERS.ARGS,
  arguments: IDL_DOCS_HEADERS.ARGS,
  keyword: IDL_DOCS_HEADERS.KEYWORDS,
  about: IDL_DOCS_HEADERS.DEFAULT,
  description: IDL_DOCS_HEADERS.DEFAULT,
  history: IDL_DOCS_HEADERS.REVISIONS,
  hidden: IDL_DOCS_HEADERS.PRIVATE,
  example: IDL_DOCS_HEADERS.EXAMPLES,
  examples: IDL_DOCS_HEADERS.EXAMPLES,
};
