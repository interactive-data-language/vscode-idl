import { existsSync, readFileSync } from 'fs';

/**
 * Helper class that tracks and manages access to instruction sets
 */
export class MCPPromptRegistry {
  /**
   * Lookup of descriptions by name/id
   */
  private descriptions: { [key: string]: string } = {};

  /**
   * Lookup of instructions by name/id
   *
   * Value is a fully-qualified filepath to disk where we can
   * read instructions from. Do this dynamically so users can
   * change instructions and get updated without restart.
   */
  private instructions: { [key: string]: string } = {};

  /**
   * Adds an instruction set to the registry
   */
  addInstruction(name: string, description: string, uri: string) {
    // get lower case
    const lc = name.toLowerCase();

    // store the instruction
    this.descriptions[lc] = description;
    this.instructions[lc] = uri;
  }

  /**
   * Returns all descriptions that we have
   */
  allDescriptions() {
    return this.descriptions;
  }

  /**
   * Gets an instruction set by name
   *
   * Use "instructionsExist()" prior to make sure the file
   * exists
   */
  getInstruction(name: string) {
    /** Get lower case name */
    const lc = name.toLowerCase();

    // return if no match
    if (!(lc in this.instructions)) {
      return;
    }

    return readFileSync(this.instructions[lc], 'utf-8');
  }

  /**
   * Returns all instruction names
   */
  getInstructionNames() {
    return Object.keys(this.instructions);
  }

  /**
   * Checks if we have an instruction set registered or not
   */
  hasInstruction(name: string) {
    return name.toLowerCase() in this.instructions;
  }

  /**
   * Returns a flag if the instructions file we are accessing exists or not
   */
  instructionsExist(name: string) {
    /** Get lower case name */
    const lc = name.toLowerCase();

    // return if no match
    if (!(lc in this.instructions)) {
      return false;
    }

    // see if it exists
    return existsSync(this.instructions[lc]);
  }
}
