import { CancellationToken } from '@idl/cancellation-tokens';
import { IParsed, RemoveScopeDetail } from '@idl/parsing/syntax-tree';
import copy from 'fast-copy';
import { DocumentSymbol, SemanticTokens } from 'vscode-languageserver';

import { IDL_INDEX_OPTIONS } from './idl-index.interface';

/**
 * If files have more than this many lines of code, we dont compress because
 * it is just too slow
 */
const COMPRESSION_LINE_THRESHOLD = 2000;

/**
 * Tags that we compress/uncompress
 */
const COMPRESS_THESE = ['tree', 'global'];

/**
 * The keys that we compress so we can pick out a single field
 */
const COMPRESS_THESE_OBJ: { [key: string]: undefined } = {};

// add keys to object
for (let i = 0; i < COMPRESS_THESE.length; i++) {
  COMPRESS_THESE_OBJ[COMPRESS_THESE[i]] = undefined;
}

/**
 * Token cache to manage more efficient storage of tokens when
 * at rest and not being used.
 */
export class IDLParsedCache {
  /**
   * Track parsed by file
   */
  private byFile: { [key: string]: IParsed } = {};

  /**
   * Compress
   */
  private compress(orig: IParsed): IParsed {
    /**
     * Check if we don't have compression enabled
     */
    if (
      !IDL_INDEX_OPTIONS.COMPRESSION ||
      orig.lines >= COMPRESSION_LINE_THRESHOLD
    ) {
      return orig;
    }

    // clean up and make non-circular
    // RemoveScopeDetailAndResetTokenCache(orig, new CancellationToken());
    RemoveScopeDetail(orig, new CancellationToken(), true);

    /**
     * Copy our original
     */
    const parsed = copy(orig);

    // compress the keys
    for (let i = 0; i < COMPRESS_THESE.length; i++) {
      parsed[COMPRESS_THESE[i]] = JSON.stringify(parsed[COMPRESS_THESE[i]]);
    }

    // return
    return parsed;
  }

  /**
   * Decompress
   */
  private decompress(compressed: IParsed): IParsed {
    /**
     * Check if we don't have compression enabled
     */
    if (
      !IDL_INDEX_OPTIONS.COMPRESSION ||
      compressed.lines >= COMPRESSION_LINE_THRESHOLD
    ) {
      return compressed;
    }

    /**
     * Shallow copy on decompress so we share root properties
     */
    const parsed = Object.assign({}, compressed);

    // unpack the keys
    for (let i = 0; i < COMPRESS_THESE.length; i++) {
      parsed[COMPRESS_THESE[i]] = JSON.parse(parsed[COMPRESS_THESE[i]]);
    }

    // return
    return parsed;
  }

  /**
   * Add parsed to the cache
   */
  add(file: string, parsed: IParsed) {
    this.byFile[file] = this.compress(parsed);
  }

  /**
   * Returns all the files we manage
   */
  allFiles() {
    return Object.keys(this.byFile);
  }

  /**
   * Checks to see if our checksum matches and is the same
   */
  checksumMatches(file: string, checksum: string) {
    if (file in this.byFile) {
      return this.byFile[file].checksum === checksum;
    }
    return false;
  }

  /**
   * Retrieve tokens by file
   *
   * Returns undefined if not present, so use the `has` method to check
   */
  get(file: string): IParsed | undefined {
    if (file in this.byFile) {
      return this.decompress(this.byFile[file]);
    }
    return undefined;
  }

  /**
   * Tells us if we have tokens or not
   */
  has(file: string): boolean {
    return file in this.byFile;
  }

  /**
   * Return file lines
   */
  lines(file: string): number | undefined {
    if (file in this.byFile) {
      return this.byFile[file].lines;
    }
  }

  /**
   * Return file outline
   */
  outline(file: string): DocumentSymbol[] | undefined {
    if (file in this.byFile) {
      return this.byFile[file].outline;
    }
  }

  /**
   * Return file semantic tokens
   *
   * Only created/updated after we post-process a file, otherwise
   * value is empty
   */
  semantic(file: string): SemanticTokens | undefined {
    if (file in this.byFile) {
      return this.byFile[file].semantic;
    }
  }

  /**
   * Returns the text for a given file or undefined if the file
   * does not exist in our cache
   */
  text(file: string): string[] | undefined {
    if (file in this.byFile) {
      return this.byFile[file].text;
    }
  }

  /**
   * Remove tokens by file
   */
  remove(file: string) {
    delete this.byFile[file];
  }

  /**
   * Returns the things that we use for a file
   *
   * Returns undefined if no matching file
   */
  uses(file: string) {
    if (file in this.byFile) {
      return this.byFile[file].uses;
    }
  }

  /**
   * Updates problems in cached parsed to reflect the latest state if we
   * are tracking the file
   */
  updateProblems(file: string, parsed: IParsed) {
    if (file in this.byFile) {
      this.byFile[file].parseProblems = parsed.parseProblems;
      this.byFile[file].postProcessProblems = parsed.postProcessProblems;
    }
  }
}
