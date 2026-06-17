import { Index } from 'flexsearch';
import { nanoid } from 'nanoid';

import { CosineSimilarity } from './cosine-similarity';
import { IEmbeddingProvider } from './embedding-provider.interface';

/**
 * Helper class to create and search content indexes.
 *
 * Supports both keyword-based search (via flexsearch) and optional
 * semantic/vector search when an IEmbeddingProvider is supplied.
 */
export class Indexer {
  /** Track content groups */
  private contentGroups: { [key: string]: string[] } = {};

  /** Track content */
  private contentMap: { [key: string]: string } = {};

  /** Stored L2-normalized embedding vectors keyed by content ID */
  private embeddings: { [key: string]: Float32Array } = {};

  /** Reference to the index */
  private index: Index;

  /** IDs that have been added or updated since the last buildEmbeddings() call */
  private pendingEmbedding: Set<string> = new Set();

  /** Optional provider for computing embeddings */
  private provider: IEmbeddingProvider | undefined;

  constructor(provider?: IEmbeddingProvider) {
    this.provider = provider;
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
    if (this.provider) {
      this.pendingEmbedding.add(id);
    }
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
   * Computes and stores embeddings for all items that have been added or
   * updated since the last call to buildEmbeddings().
   *
   * This is a no-op when no provider is configured or there are no pending
   * items. Callers should await this after a bulk registration phase so that
   * all items are indexed before the first semanticSearch() call.
   */
  async buildEmbeddings(): Promise<void> {
    if (!this.provider || this.pendingEmbedding.size === 0) {
      return;
    }

    /** Snapshot pending IDs so we can clear before awaiting */
    const ids = Array.from(this.pendingEmbedding);
    this.pendingEmbedding.clear();

    /** Gather the text for each pending ID (skip any that were removed) */
    const validIds: string[] = [];
    const texts: string[] = [];
    for (let i = 0; i < ids.length; i++) {
      if (ids[i] in this.contentMap) {
        validIds.push(ids[i]);
        texts.push(this.contentMap[ids[i]]);
      }
    }

    if (validIds.length === 0) {
      return;
    }

    const vectors = await this.provider.embed(texts);
    for (let i = 0; i < validIds.length; i++) {
      this.embeddings[validIds[i]] = vectors[i];
    }
  }

  /**
   * Get content by ID
   */
  get(id: string): string {
    return this.contentMap[id] || '';
  }

  /**
   * Returns if we have a resource by ID
   */
  has(id: string): boolean {
    return id in this.contentMap;
  }

  /**
   * Returns whether an embedding provider is configured on this indexer
   */
  hasEmbeddingProvider(): boolean {
    return this.provider !== undefined;
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
    delete this.embeddings[id];
    this.pendingEmbedding.delete(id);
  }

  /**
   * Removes a group of content from our index if we have tracked it
   */
  removeContentGroup(contentGroupId: string) {
    // make sure we exist
    if (contentGroupId in this.contentGroups) {
      /** Get content IDs */
      const ids = this.contentGroups[contentGroupId];

      // clean up
      delete this.contentGroups[contentGroupId];

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
   * Searches the index using vector similarity and returns matching content
   * strings (same shape as search()).
   *
   * Builds embeddings for any pending items before querying.
   * Returns an empty array when no provider is configured.
   */
  async semanticSearch(query: string, limit = 10): Promise<string[]> {
    const ids = await this.semanticSearchIds(query, limit);
    return ids
      .filter((id) => id in this.contentMap)
      .map((id) => this.contentMap[id]);
  }

  /**
   * Searches the index using vector similarity and returns the IDs of matching
   * items in ranked order (most similar first).
   *
   * Builds embeddings for any pending items before querying.
   * Returns an empty array when no provider is configured.
   */
  async semanticSearchIds(query: string, limit = 10): Promise<string[]> {
    if (!this.provider) {
      return [];
    }

    // ensure any pending items are embedded
    await this.buildEmbeddings();

    /** Embed the query */
    const [queryVector] = await this.provider.embed([query]);

    /** All stored IDs that have embeddings */
    const ids = Object.keys(this.embeddings);

    if (ids.length === 0) {
      return [];
    }

    /** Score each stored embedding */
    const scored: { id: string; score: number }[] = new Array(ids.length);
    for (let i = 0; i < ids.length; i++) {
      scored[i] = {
        id: ids[i],
        score: CosineSimilarity(queryVector, this.embeddings[ids[i]]),
      };
    }

    /** Sort descending by score and return top-k IDs */
    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, limit).map((item) => item.id);
  }

  /**
   * Update content in the index
   */
  update(id: string, text: string): void {
    this.index.update(id, text);
    this.contentMap[id] = text;
    if (this.provider) {
      this.pendingEmbedding.add(id);
    }
  }
}
