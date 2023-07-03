import { IDL_DOCS_HEADERS } from './docs.interface';

/**
 * Map to convert IDL Docs tags to the internal lookup so they are consistent
 * and allows migrating/accounting for slightly different flavors of docs
 */
export const IDL_HEADER_MAP: { [key: string]: string } = {
  params: IDL_DOCS_HEADERS.ARGS,
  parameters: IDL_DOCS_HEADERS.ARGS,
  args: IDL_DOCS_HEADERS.ARGS,
  arguments: IDL_DOCS_HEADERS.ARGS,
  about: IDL_DOCS_HEADERS.DEFAULT,
  description: IDL_DOCS_HEADERS.DEFAULT,
  history: IDL_DOCS_HEADERS.REVISIONS,
};
