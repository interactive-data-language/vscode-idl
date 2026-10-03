import {
  RegistryLocation,
  RegistryLocation_File,
  RegistryLocation_Memory,
} from '@idl/mcp/shared';
import { ChatInstructionType } from '@idl/types/chat';

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
  location: RegistryLocation<RegistryLocation_File | RegistryLocation_Memory>;

  /**
   * Metadata associated with the instruction
   */
  metadata: IInstructionMetadata;
}

export const INSTRUCTIONS_EXTENSION = '.instructions.md';
