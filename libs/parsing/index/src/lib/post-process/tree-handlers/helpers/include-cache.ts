import { CancellationToken } from '@idl/cancellation-tokens';
import { CodeChecksum, Parser } from '@idl/parser';
import {
  IParsed,
  RemoveScopeDetail,
  ResetTokenCache,
} from '@idl/parsing/syntax-tree';
import { readFileSync } from 'fs';

import { IDLIndex } from '../../../idl-index.class';
import { PostProcessParsed } from '../../post-process-parsed';

/**
 * Actual cache
 */
const CACHE: { [key: string]: IParsed } = {};

/**
 * Manges a basic cache for include statements so we don't read the same
 * file over and over
 */
export function IncludeCache(
  index: IDLIndex,
  file: string,
  cancel: CancellationToken
) {
  const strings = readFileSync(file, 'utf-8');

  // check for and validate cache
  if (file in CACHE) {
    if (CACHE[file].checksum === CodeChecksum(strings)) {
      return CACHE[file];
    }
  }

  // parse
  const parsed = Parser(strings, cancel);

  // post-process and do some type defining
  PostProcessParsed(index, file, parsed, cancel);

  // clean up
  RemoveScopeDetail(parsed, cancel);
  ResetTokenCache(parsed, cancel);

  // remove globals to save memory
  parsed.global = [];

  // save in cache
  CACHE[file] = parsed;

  // return
  return parsed;
}
