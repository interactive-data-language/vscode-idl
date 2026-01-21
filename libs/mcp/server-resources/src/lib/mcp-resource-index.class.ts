import { Indexer } from '@idl/indexing/indexer';

/**
 * Index for our server resource
 */
const INDEX = new Indexer();

/**
 * Class that manages resources for our MCP server
 */
export class MCPResourceIndex {
  /**
   * Add items to the index
   */
  static add(id: string, content: string) {
    INDEX.add(id, content);
  }

  /**
   * Add a group of content to the index
   */
  static addContentGroup(contentGroupId: string, content: string[]) {
    INDEX.addContentGroup(contentGroupId, content);
  }

  /**
   * Get a resource by name
   */
  static get(name: string) {
    return INDEX.get(name);
  }

  /**
   * Retrns if we have a resource by name
   */
  static has(name: string) {
    return INDEX.has(name);
  }

  /**
   * Return all registered resources by name
   */
  static list() {
    return INDEX.list();
  }

  /**
   * Remove an item from the index
   */
  static remove(id: string) {
    INDEX.remove(id);
  }

  /**
   * Remove a group of content
   */
  static removeContentGroup(contentGroupId: string) {
    INDEX.removeContentGroup(contentGroupId);
  }

  /**
   * Search the index
   */
  static search(query: string) {
    return INDEX.search(query);
  }

  /**
   * Update the search index
   */
  static update(id: string, content: string) {
    INDEX.update(id, content);
  }
}
