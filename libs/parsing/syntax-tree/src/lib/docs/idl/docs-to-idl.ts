import {
  GlobalStructureToken,
  IGlobalIndexedToken,
  IParameterLookup,
  IParameterOrPropertyDetails,
  SerializeIDLType,
} from '@idl/data-types/core';
import { IDL_TRANSLATION } from '@idl/translation';

import { IDL_DOCS_HEADERS } from '../docs.interface';
import {
  MarkdownInfo,
  RoutineMarkdown,
} from '../markdown/docs-to-markdown.interface';
import { CapitalizeWord } from '../markdown/helpers/capitalize-word';

/**
 * Specify docs tags that we should skip because they are manually handled or
 * processed before we get here
 */
const SKIP_THESE: { [key: string]: boolean } = {};
SKIP_THESE[IDL_DOCS_HEADERS.PRIVATE] = true;
SKIP_THESE[IDL_DOCS_HEADERS.TOOLTIP] = true;
SKIP_THESE[IDL_DOCS_HEADERS.DEFAULT] = true;
SKIP_THESE[IDL_DOCS_HEADERS.RETURNS] = true;
SKIP_THESE[IDL_DOCS_HEADERS.ARGS] = true;
SKIP_THESE[IDL_DOCS_HEADERS.KEYWORDS] = true;
SKIP_THESE[IDL_DOCS_HEADERS.AUTHOR] = true;
SKIP_THESE[IDL_DOCS_HEADERS.REVISIONS] = true;

/**
 * Start of comment lines
 */
const LINE_START = '; ';

const REGEX_START = /[^\s]/im;

/**
 * Splits content and joins together based on user parameters
 */
function SplitJoin(strings: string[], content: string, before = LINE_START) {
  // split the string
  const split = content.split(/\n/gim);

  /** Track if we trimmed left or not */
  let checked = false;

  /** Track substring start */
  let posStart = 0;

  // merge
  for (let i = 0; i < split.length; i++) {
    // check if we need to trim left by examining the first non-null string
    if (split[i].trimEnd() && !checked) {
      checked = true;
      const start = REGEX_START.exec(split[i]);
      if (start !== null) {
        posStart = start.index;
      }
    }
    strings.push(`${before}${split[i].substring(posStart).trimEnd()}`);
  }
}

/**
 * Adds space in comments between each section if needed
 */
function AddSpace(strings: string[]) {
  if (strings.length > 1) {
    strings.push(';');
  }
}

/**
 * Adds a header into our comments
 */
function MakeHeader(header: string) {
  return `${LINE_START}:${header}:`;
}

/**
 * Makes docs for a single parameter
 */
function MakeParamDocs(
  strings: string[],
  param: IParameterOrPropertyDetails,
  isProperty: boolean
) {
  // add formatted line based on parameters
  if (isProperty) {
    strings.push(
      `${LINE_START}  ${param.display}: ${SerializeIDLType(param.type)}`
    );
  } else {
    // get text to embed
    const req = param.req ? 'required' : 'optional';
    const isPrivate = param.private ? ', private' : '';

    strings.push(
      `${LINE_START}  ${param.display}: ${
        param.direction
      }, ${req}, ${SerializeIDLType(param.type)}${isPrivate}`
    );
  }

  // fill value of params docs if it doesnt have anything
  const lines: string[] =
    param.docs !== ''
      ? param.docs.split(/\n/gim)
      : [IDL_TRANSLATION.docs.placeholder.params];
  for (let j = 0; j < lines.length; j++) {
    strings.push(`${LINE_START}    ${lines[j]}`);
  }
}

/**
 * Makes docs for arguments or keywords
 */
function MakeParameterDocs(
  strings: string[],
  header: string,
  lookup: IParameterLookup,
  isProperty: boolean,
  sort = false
) {
  // init parameters
  let params: IParameterOrPropertyDetails[] = [];

  // check if we need to sort by the name of our parameters or not
  if (sort) {
    const names = Object.keys(lookup).sort();
    for (let i = 0; i < names.length; i++) {
      params.push(lookup[names[i]]);
    }
  } else {
    params = Object.values(lookup);
  }

  if (isProperty && params.length === 0) {
    strings.push(MakeHeader(header));
    AddSpace(strings);
  }

  // check if we have work to do
  if (params.length > 0) {
    strings.push(MakeHeader(header));

    // process valid params
    for (let i = 0; i < params.length; i++) {
      if (!params[i].code) {
        continue;
      }
      MakeParamDocs(strings, params[i], isProperty);
    }

    // process invalid params
    for (let i = 0; i < params.length; i++) {
      if (params[i].code) {
        continue;
      }
      MakeParamDocs(strings, params[i], isProperty);
    }

    AddSpace(strings);
  }
}

/**
 * Converts docs for a structure to strings
 */
export function DocsToIDLForStructures(
  info: IGlobalIndexedToken<GlobalStructureToken>
): string[] {
  /** String array of text for docs */
  const strings: string[] = [];

  // process any structures
  MakeParameterDocs(strings, info.meta.display, info.meta.props, true, true);

  // push extra space if needed to give space between us and the next item
  if (strings.length === 1) {
    strings.push(';');
  }

  return strings;
}

/**
 * Converts docs/metadata for routines back into IDL comments so that
 * we automatically add args/keywords to source code for users.
 *
 * This will automatically fix some problems in the docs, so we may need
 * to think about how it comes together in the real world.
 */
export function DocsToIDL(info: MarkdownInfo<RoutineMarkdown>): string[] {
  /** String array of text for docs */
  let strings: string[] = [';+'];

  /** Metadata for routine */
  const meta = info.meta;

  // extract other docs to process
  const docs = info.meta.docsLookup;

  // check if we have a return value - i.e. we are a function
  if (meta.private) {
    strings.push(MakeHeader('Private'));
    AddSpace(strings);
  }

  // add our basic header information
  if (IDL_DOCS_HEADERS.TOOLTIP in docs) {
    if (docs[IDL_DOCS_HEADERS.TOOLTIP].trim() !== '') {
      strings.push(MakeHeader('Tooltip'));
      SplitJoin(strings, docs[IDL_DOCS_HEADERS.TOOLTIP], `${LINE_START}  `);
      AddSpace(strings);
    }
  }

  // add our basic header information
  if (IDL_DOCS_HEADERS.DEFAULT in docs) {
    if (docs[IDL_DOCS_HEADERS.DEFAULT].trim() !== '') {
      strings.push(MakeHeader('Description'));
      SplitJoin(strings, docs[IDL_DOCS_HEADERS.DEFAULT], `${LINE_START}  `);
      AddSpace(strings);
    }
  }

  // check if we have a return value - i.e. we are a function
  if ('returns' in meta) {
    strings.push(`${MakeHeader('Returns')} ${SerializeIDLType(meta.returns)}`);
    AddSpace(strings);
  }

  // add arguments
  if (meta.args !== undefined) {
    MakeParameterDocs(strings, 'Arguments', meta.args, false);
  }

  // add keywords
  if (meta.kws !== undefined) {
    MakeParameterDocs(strings, 'Keywords', meta.kws, false, true);
  }

  // process any structures
  if (meta.struct !== undefined) {
    for (let i = 0; i < meta.struct.length; i++) {
      strings = strings.concat(DocsToIDLForStructures(meta.struct[i]));
    }
  }

  // process any other user tags
  const keys = Object.keys(docs);

  // process each key
  for (let i = 0; i < keys.length; i++) {
    if (keys[i] in SKIP_THESE) {
      continue;
    }

    // skip if nothing to save
    if (docs[keys[i]].trim() === '') {
      continue;
    }

    strings.push(MakeHeader(CapitalizeWord(keys[i])));
    SplitJoin(strings, docs[keys[i]], `${LINE_START}  `);
    AddSpace(strings);
  }

  // add our basic header information
  if (IDL_DOCS_HEADERS.AUTHOR in docs) {
    if (docs[IDL_DOCS_HEADERS.AUTHOR].trim() !== '') {
      strings.push(MakeHeader('Author'));
      SplitJoin(strings, docs[IDL_DOCS_HEADERS.AUTHOR], `${LINE_START}  `);
      AddSpace(strings);
    }
  }

  // add our basic header information
  if (IDL_DOCS_HEADERS.REVISIONS in docs) {
    if (docs[IDL_DOCS_HEADERS.REVISIONS].trim() !== '') {
      strings.push(MakeHeader('Revisions'));
      SplitJoin(strings, docs[IDL_DOCS_HEADERS.REVISIONS], `${LINE_START}  `);
      AddSpace(strings);
    }
  }

  // close docs block for consistency
  strings.push(';-');

  return strings;
}
