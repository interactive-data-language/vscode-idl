import { IDocs } from '../extract-docs.interface';
import { GeneralToMarkdown } from './converters/general';
import { RoutinesToMarkdown } from './converters/routines';
import { VariablesToMarkdown } from './converters/variables';
import {
  MARKDOWN_TYPE_LOOKUP,
  MarkdownInfo,
  MarkdownType,
  RoutineMarkdown,
} from './docs-to-markdown.interface';

/**
 * Converts documentation to markdown and adjusts formatting/logic
 * based on the type of feature we are converting to markdown
 */
export function DocsToMarkdown<T extends MarkdownType>(
  type: T,
  info: MarkdownInfo<T>
): string {
  // find the right converter
  switch (type) {
    case MARKDOWN_TYPE_LOOKUP.GENERAL:
      return GeneralToMarkdown(info as { [key: string]: string });
    case MARKDOWN_TYPE_LOOKUP.VARIABLE:
      return VariablesToMarkdown(info as IDocs);
    case MARKDOWN_TYPE_LOOKUP.ROUTINE:
      return RoutinesToMarkdown(info as MarkdownInfo<RoutineMarkdown>);
    default:
      break;
  }
}
