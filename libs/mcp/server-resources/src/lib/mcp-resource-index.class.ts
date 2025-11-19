import { Indexer } from '@idl/indexing/indexer';

/**
 * Index for our server resource
 */
const INDEX = new Indexer();

/**
 * Class that manages resources for our MCP server
 */
export class MCPResourceIndex {
  static add(id: string, content: string) {
    INDEX.add(id, content);
  }

  static addContentGroup(contentGroupId: string, content: string[]) {
    INDEX.addContentGroup(contentGroupId, content);
  }

  static remove(id: string) {
    INDEX.remove(id);
  }

  static removeContentGroup(contentGroupId: string) {
    INDEX.removeContentGroup(contentGroupId);
  }

  static search(query: string) {
    return INDEX.search(query);
  }

  static update(id: string, content: string) {
    INDEX.update(id, content);
  }
}
