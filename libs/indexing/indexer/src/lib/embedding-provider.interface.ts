/**
 * Interface for a provider that generates embeddings for text
 */
export interface IEmbeddingProvider {
  /**
   * Embeds a batch of texts and returns L2-normalized vectors.
   *
   * All vectors are normalized so dot product equals cosine similarity.
   */
  embed(texts: string[]): Promise<Float32Array[]>;

  /**
   * Resolves once the provider (model, pipeline, etc.) is fully initialized
   * and ready to embed. Callers may await this before the first embed() call,
   * but embed() will also initialize lazily if ready() has not been called.
   */
  ready(): Promise<void>;
}
