import { IDocs } from '@idl/types/syntax-tree';

import {
  FunctionRoutineType,
  ProcedureRoutineType,
  RoutineMetadata,
  RoutineType,
  StructureRoutineType,
} from '../generate-routine-metadata.interface';

/** Type to convert general content to markdown */
export type GeneralMarkdown = 'general';

/** Type to convert docs to markdown for routines */
export type RoutineMarkdown = 'routine';

/** Convert structure to docs to markdown */
export type StructureMarkdown = 'structure';

/** type to convert docs to markdown for variables */
export type VariableMarkdown = 'variable';

/**
 * Allowed types for markdown docs which controls how we convert the docs
 * we extract to markdown.
 */
export type MarkdownType =
  | GeneralMarkdown
  | RoutineMarkdown
  | StructureMarkdown
  | VariableMarkdown;

/**
 * Strictly types interface for the types of markdown converters we have
 */
interface IMarkdownLookup {
  /** Type to convert general content to markdown */
  GENERAL: GeneralMarkdown;
  /** type to convert docs to markdown for routines */
  ROUTINE: RoutineMarkdown;
  /** Convert structure to docs to markdown */
  STRUCTURE: StructureMarkdown;
  /** type to convert docs to markdown for variables */
  VARIABLE: VariableMarkdown;
}

/**
 * Allowed types for markdown conversion. Used to separate and identify
 * different markdown converters which will potentially depend on the type
 */
export const MARKDOWN_TYPE_LOOKUP: IMarkdownLookup = {
  GENERAL: 'general',
  ROUTINE: 'routine',
  STRUCTURE: 'structure',
  VARIABLE: 'variable',
};

/**
 * Information that we need for routines to properly convert to markdown
 */
export type RoutineMarkdownInfo<T extends RoutineType> = {
  /**
   * Detailed information about our routines
   */
  meta: RoutineMetadata<T>;
  /**
   * The name of the routine we are documenting
   */
  name: string;
  /**
   * If set, indicates that there is a URL which will take the user
   * to an official docs site.
   */
  link?: string;
};

/**
 * Information that we expect to specify when we are generating markdown for a specific type
 */
export type MarkdownInfo<T extends MarkdownType> = T extends GeneralMarkdown
  ? { [key: string]: string }
  : T extends RoutineMarkdown
  ? RoutineMarkdownInfo<FunctionRoutineType | ProcedureRoutineType>
  : T extends StructureMarkdown
  ? RoutineMarkdownInfo<StructureRoutineType>
  : T extends VariableMarkdown
  ? IDocs
  : never;
