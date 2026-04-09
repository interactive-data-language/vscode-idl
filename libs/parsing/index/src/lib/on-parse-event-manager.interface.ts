import { IDLFileType } from '@idl/shared/extension';
import { IGlobalsToTrack } from '@idl/types/tasks';

/**
 * Base payload for all parse events
 */
export interface BaseParseEventPayload {
  /** URI of the file that was parsed */
  uri: string;
}

/**
 * Payload for PRO file parse events
 */
export interface ProParseEventPayload extends BaseParseEventPayload {
  /** Number of routines found */
  routineCount: number;
  type: 'pro';
}

/**
 * Payload for PRO definition file parse events
 */
export interface ProDefParseEventPayload extends BaseParseEventPayload {
  /** Number of routines found */
  routineCount: number;
  type: 'pro-def';
}

/**
 * Payload for SAVE file parse events
 */
export interface SaveParseEventPayload extends BaseParseEventPayload {
  type: 'save';
}

/**
 * Payload for idl.json file parse events
 */
export interface IdlJsonParseEventPayload extends BaseParseEventPayload {
  type: 'idl.json';
}

/**
 * Payload for IDL task file parse events
 */
export interface IdlTaskParseEventPayload extends BaseParseEventPayload {
  /** Global tokens from parsing the task */
  globals: IGlobalsToTrack;
  type: 'idl-task';
}

/**
 * Payload for ENVI task file parse events
 */
export interface EnviTaskParseEventPayload extends BaseParseEventPayload {
  /** Global tokens from parsing the task */
  globals: IGlobalsToTrack;
  type: 'envi-task';
}

/**
 * Payload for IDL notebook file parse events
 */
export interface IdlNotebookParseEventPayload extends BaseParseEventPayload {
  /** Number of cells */
  cellCount?: number;
  type: 'idl-notebook';
}

/**
 * Map from file type to parse event payload type
 */
export type ParseEventPayloadMap = {
  pro: ProParseEventPayload;
  'pro-def': ProDefParseEventPayload;
  save: SaveParseEventPayload;
  'idl.json': IdlJsonParseEventPayload;
  'idl-task': IdlTaskParseEventPayload;
  'envi-task': EnviTaskParseEventPayload;
  'idl-notebook': IdlNotebookParseEventPayload;
};

/**
 * Type-safe event listener callback
 */
export type ParseEventListener<T extends IDLFileType> = (
  payload: ParseEventPayloadMap[T],
) => void;
