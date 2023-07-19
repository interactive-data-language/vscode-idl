import {
  IParsed,
  RemoveScopeDetail,
  ResetTokenCache,
} from '@idl/parsing/syntax-tree';
import copy from 'fast-copy';

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
    // return orig;
    // copy
    const parsed = copy(orig);

    // make non-circular
    ResetTokenCache(parsed);
    RemoveScopeDetail(parsed);

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
    // return compressed;
    // copy decompressed data
    const parsed = copy(compressed);

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
}
