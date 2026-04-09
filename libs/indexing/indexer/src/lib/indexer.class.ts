import { Index } from 'flexsearch';
import { nanoid } from 'nanoid';

/**
 * Helper class to create and search content indexes
 */
export class Indexer {
  /** Track content groups */
  private contentGroups: { [key: string]: string[] } = {};

  /** Track content */
  private contentMap: { [key: string]: string } = {};

  /** Reference to the index */
  private index: Index;

  constructor() {
    this.index = new Index({
      tokenize: 'forward',
      cache: true,
    });
  }

  /**
   * Add content to the index
   * @param id Unique identifier for the content
   * @param text Text content to index
   */
  add(id: string, text: string): void {
    this.index.add(id, text);
    this.contentMap[id] = text;
  }

  /**
   * Adds a collection of content under a group ID for
   * each batch adding/removal
   *
   * Used for tracking all relevant content by things like
   * files.
   *
   * Removes content group if it was already tracked so that
   * it can be updated (in case number of elements changes).
   */
  addContentGroup(contentGroupId: string, content: string[]) {
    // remove if it exists
    this.removeContentGroup(contentGroupId);

    /** IDs for our content group */
    const ourIds: string[] = [];

    // save each piece of content
    for (let i = 0; i < content.length; i++) {
      /** get ID for our piece of content */
      const id = `${contentGroupId}-item-${i}-${nanoid()}`;

      // save ID
      ourIds.push(id);

      // add to our index
      this.add(id, content[i]);
    }

    // save our IDs
    this.contentGroups[contentGroupId] = ourIds;
  }

  /**
   * Get content by ID
   */
  get(id: string): string {
    return this.contentMap[id] || '';
  }

  /**
   * Retrns if we have a resource by ID
   */
  has(id: string): boolean {
    return id in this.contentMap;
  }

  /**
   * Return all registered resources by name
   */
  list() {
    return Object.keys(this.contentMap);
  }

  /**
   * Remove content from the index
   */
  remove(id: string): void {
    this.index.remove(id);
    delete this.contentMap[id];
  }

  /**
   * Removes a group of content from our index if we have tracked it
   */
  removeContentGroup(contentGroupId: string) {
    // make sure we exist
    if (contentGroupId in this.contentGroups) {
      /** Get content IDs */
      const ids = this.addContentGroup[contentGroupId];

      // clean up
      delete this.contentGroups;

      // remove each item
      for (let i = 0; i < ids.length; i++) {
        this.remove(ids[i]);
      }
    }
  }

  /**
   * Search the index and return matching content
   */
  search(query: string): string[] {
    return (this.index.search(query, { limit: 20 }) as string[]).map((id) =>
      this.get(id),
    );
  }

  /**
   * Update content in the index
   */
  update(id: string, text: string): void {
    this.index.update(id, text);
    this.contentMap[id] = text;
  }
}
