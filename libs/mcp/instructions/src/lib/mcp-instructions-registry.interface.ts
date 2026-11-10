import type { LogManager } from '@idl/logger';
import type { AnalyticsRepositoryRegistry } from '@idl/mcp/analytics-repository';
import type {
  IRuleBasedFilters,
  RegistryLocation,
  RegistryLocation_File,
  RegistryLocation_Memory,
  RegistryLocation_Repository,
} from '@idl/mcp/shared';
import type { ChatInstructionType } from '@idl/types/chat';

/**
 * Options for creating an instructions registry
 */
export interface IMCPInstructionsRegistryOptions {
  /** Analytics repositories to pull instructions from */
  analytics?: AnalyticsRepositoryRegistry;
  /** Initial whitelist and blacklist */
  filters?: Partial<IRuleBasedFilters>;
  /** Local folder to load (and watch) instructions from */
  localDir?: string;
  /** Logger for reporting problems */
  logger?: LogManager;
}

/**
 * Metadata parsed from GitHub Copilot-style YAML frontmatter in instruction files.
 */
export interface IInstructionMetadata {
  /**
   * File pattern matching rules for instructions (optional)
   */
  applyTo?: string;

  /**
   * Short description of the instruction set
   */
  description?: string;

  /**
   * Should option be hidden from the UI
   */
  hidden?: boolean;

  /**
   * Unique identifier for the instruction set (derived from frontmatter id/name or filename)
   */
  id: ChatInstructionType;

  /**
   * Additional instruction set IDs to include/append when reading this instruction
   */
  includes?: ChatInstructionType[];

  /**
   * Human-readable display name
   */
  name: string;
}

/**
 * Registry entry representing a tracked instruction location and its metadata
 */
export interface IInstructionEntry {
  /**
   * Location of the instruction file or memory content
   */
  location: RegistryLocation<
    | RegistryLocation_File
    | RegistryLocation_Memory
    | RegistryLocation_Repository
  >;

  /**
   * Metadata associated with the instruction
   */
  metadata: IInstructionMetadata;
}

export const INSTRUCTIONS_EXTENSION = '.instructions.md';
