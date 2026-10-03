import {
  IRuleBasedFilters,
  RegistryFileWatcher,
  RegistryLocationHelpers,
  RuleBasedFilter,
} from '@idl/mcp/shared';
import { ChatInstructionOption } from '@idl/types/chat';
import { existsSync, mkdirSync, readdirSync, readFileSync } from 'fs';
import { basename, join } from 'path';

import { ParseInstructionFrontmatter } from './helpers/parse-instruction-frontmatter';
import {
  IInstructionEntry,
  INSTRUCTIONS_EXTENSION,
} from './mcp-instructions-registry.interface';

/**
 * Helper class that tracks and manages access to system instruction files and content
 */
export class MCPInstructionsRegistry {
  /** Object class that handles filtering items from the instructions registry */
  filters = new RuleBasedFilter();

  /**
   * Lookup of instructions by ID and location metadata
   */
  private instructions: {
    [key: string]: IInstructionEntry;
  } = {};

  /**
   * Local instruction folder path
   */
  private localDir?: string;

  /**
   * Watches the local instruction folder so new/removed files stay in sync
   */
  private watcher?: RegistryFileWatcher;

  constructor(localDir?: string, filters?: Partial<IRuleBasedFilters>) {
    this.localDir = localDir;

    if (this.localDir) {
      // make the local folder if it doesn't exist
      if (!existsSync(this.localDir)) {
        mkdirSync(this.localDir, { recursive: true });
      }

      // load instructions from local directory
      this.loadInstructionsFromFolder(this.localDir);

      // keep the registry in sync as instruction files are added/removed on disk
      this.watcher = new RegistryFileWatcher({
        folder: this.localDir,
        filter: /\.md$/i,
        onCreate: (location) =>
          this.addInstructionFromFile(location.meta.path, true),
        onDelete: (location) =>
          this.removeInstructionFromFile(location.meta.path),
      });
    }

    // save filters
    if (filters !== undefined) {
      this.filters.updateFilters(filters);
    }
  }

  /**
   * Adds instruction text directly to memory in the registry.
   */
  addInstruction(
    instructionId: string,
    instructionText: string,
    replace = false,
  ) {
    const parsed = ParseInstructionFrontmatter(instructionText, instructionId);
    const id = parsed.metadata.id;

    if (!replace && id in this.instructions) {
      return;
    }

    this.instructions[id] = {
      location: {
        type: 'memory',
        meta: {
          content: parsed.content,
        },
      },
      metadata: parsed.metadata,
    };
  }

  /**
   * Adds an instruction entry from a file on disk.
   * Reads only metadata at registration time; content is read on-demand later.
   */
  addInstructionFromFile(filePath: string, replace = false) {
    const defaultId = basename(filePath, INSTRUCTIONS_EXTENSION)
      .replace(/\.md$/, '')
      .toLowerCase();

    try {
      const parsed = ParseInstructionFrontmatter(
        readFileSync(filePath, 'utf-8'),
        defaultId,
      );
      const id = parsed.metadata.id;

      if (!replace && id in this.instructions) {
        return;
      }

      this.instructions[id] = {
        location: {
          type: 'file',
          meta: {
            path: filePath,
          },
        },
        metadata: parsed.metadata,
      };
    } catch {
      // Ignore unreadable files
    }
  }

  /**
   * Stops watching the local instruction folder for changes
   */
  dispose() {
    this.watcher?.stop();
  }

  /**
   * Reads and resolves instruction content on-demand from disk or memory.
   * Handles dynamic recursive `includes` resolution (e.g., 'idl-envi' loading 'idl' and 'envi').
   */
  getInstruction(instructionId: string, seen = new Set<string>()): string {
    // get lower case ID
    const lc = instructionId.toLowerCase();

    // return if no instructions, or we already visited this ID (circular includes)
    if (!(lc in this.instructions) || seen.has(lc)) {
      return '';
    }
    seen.add(lc);

    // get entry
    const entry = this.instructions[lc];

    // get all instructions we require
    const includes = (entry.metadata.includes || []).map((id) =>
      this.getInstruction(id, seen),
    );

    return [
      RegistryLocationHelpers.retrieveContent(entry.location),
      ...includes,
    ]
      .filter((item) => item.trim())
      .join('\n\n---\n\n');
  }

  /**
   * Returns all registered instruction IDs allowed by filters
   */
  getInstructionNames(): string[] {
    return Object.keys(this.instructions).filter((id) =>
      this.filters.isAllowedByFilters(id),
    );
  }

  /**
   * Returns available chat instruction options formatted for the API / UI
   */
  getInstructionOptionsForUI(): ChatInstructionOption[] {
    return Object.values(this.instructions)
      .filter(
        (item) =>
          this.filters.isAllowedByFilters(item.metadata.id) &&
          !item.metadata.hidden,
      )
      .map((item) => {
        return {
          id: item.metadata.id,
          name: item.metadata.name,
          description: item.metadata.description || '',
        };
      });
  }

  /**
   * Checks if an instruction is registered
   */
  hasInstruction(instructionId: string): boolean {
    return instructionId.toLowerCase() in this.instructions;
  }

  /**
   * Loads markdown files from a folder non-recursively
   */
  loadInstructionsFromFolder(folder: string, replace = false) {
    if (!existsSync(folder)) {
      return;
    }

    const files = readdirSync(folder)
      .filter((f) => f.toLowerCase().endsWith(INSTRUCTIONS_EXTENSION))
      .map((file) => join(folder, file));

    for (const filePath of files) {
      this.addInstructionFromFile(filePath, replace);
    }
  }

  /**
   * Refresh the local instruction list
   */
  refreshLocalInstructionList() {
    if (this.localDir) {
      this.loadInstructionsFromFolder(this.localDir, true);
    }
  }

  /**
   * Removes an instruction that was tracked from a file path
   */
  removeInstructionFromFile(filePath: string) {
    // find the item to delete
    const match = Object.values(this.instructions).find((item) => {
      return item.location.type === 'file'
        ? item.location.meta.path === filePath
        : false;
    });

    // if found, delete
    if (match) {
      delete this.instructions[match.metadata.id];
    }
  }
}
