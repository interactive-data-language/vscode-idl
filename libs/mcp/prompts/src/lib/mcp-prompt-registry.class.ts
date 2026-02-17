import { LogManager } from '@idl/logger';

import {
  MCPPromptLookup,
  MCPPromptType,
} from './mcp-prompt-registry.interface';

/**
 * Helper class that tracks and manages access to instruction sets
 */
export class MCPPromptRegistry {
  /**
   * Logger
   */
  private logger: LogManager;

  /**
   * Lookup of prompts
   *
   * Key is the name, value is all information we need for prompts
   */
  private prompts: { [key: string]: MCPPromptLookup } = {};

  constructor(logger: LogManager) {
    this.logger = logger;
  }

  /**
   * Adds an instruction set to the registry
   */
  addPrompt(info: MCPPromptLookup) {
    this.prompts[info.name.toLowerCase()] = info;
  }

  /**
   * Returns all descriptions that we have
   */
  descriptions(type?: 'all' | MCPPromptType): { [key: string]: string } {
    /** Track descriptions */
    const descriptions: { [key: string]: string } = {};

    // init value with all prompts
    let toMap = Object.values(this.prompts);

    /**
     * Check if we need to filter
     */
    switch (type) {
      // only ENVI
      case 'envi':
        toMap = toMap.filter((item) => item.type === 'envi');
        break;

      // only IDL
      case 'idl':
        toMap = toMap.filter((item) => item.type === 'idl');
        break;

      default:
        break;
    }

    // populate
    for (let i = 0; i < toMap.length; i++) {
      descriptions[toMap[i].name] = toMap[i].description;
    }

    // return value
    return descriptions;
  }

  /**
   * Gets a prompt set by name
   */
  getPrompt(name: string) {
    /** Get lower case name */
    const lc = name.toLowerCase();

    // return if no match
    if (!(lc in this.prompts)) {
      return;
    }

    return this.prompts[lc].prompt;
  }

  /**
   * Checks if we have a prompt file or not
   */
  hasPrompt(name: string) {
    return name.toLowerCase() in this.prompts;
  }
}
