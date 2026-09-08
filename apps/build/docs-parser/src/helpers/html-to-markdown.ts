import { stringify } from 'himalaya';
import { NodeHtmlMarkdown } from 'node-html-markdown';

import { IParsedHTML } from './parser.interface';
import { ReplaceLinks } from './replace-links';

/** HTML to markdown converter */
const NHM = new NodeHtmlMarkdown({
  codeBlockStyle: 'fenced',
});

/**
 * Does a basic conversion from HTML to Markdown without checking/validating links
 */
export function HTMLToMarkdownBasic(html: IParsedHTML[]) {
  return NHM.translate(stringify(html));
}

/**
 * Converts parsed HTML elements to Markdown
 */
export function HTMLToMarkdown(html: IParsedHTML[], folder: string) {
  // get the single markdown line
  const md = NHM.translate(stringify(html));

  return ReplaceLinks(md, folder);
}

/**
 * Converts a string to markdown
 */
export function StringToMarkdown(content: string, folder: string) {
  // get the single markdown line
  const md = NHM.translate(content);

  return ReplaceLinks(md, folder);
}
