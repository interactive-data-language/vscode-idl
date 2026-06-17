import { IEmbeddingProvider } from '@idl/indexing/indexer';

import { EMBEDDINGS_CONFIG } from './embeddings-config';

/**
 * Default model used for embeddings.
 *
 * AllMiniLML6V2 (all-MiniLM-L6-v2) is ~23 MB, produces 384-dimensional
 * L2-normalized vectors, and runs CPU-only via ONNX Runtime.
 * The model is downloaded from the fastembed CDN on first use and cached
 * locally on disk for subsequent runs.
 */
const DEFAULT_MODEL = 'fast-all-MiniLM-L6-v2';

/**
 * Embedding provider backed by fastembed (ONNX Runtime, CPU-only).
 *
 * fastembed uses onnxruntime-node directly with no image-processing
 * dependencies. Models are downloaded at runtime and cached on disk.
 *
 * All returned vectors are L2-normalized so dot product equals cosine similarity.
 */
export class TransformersEmbeddingProvider implements IEmbeddingProvider {
  /** Directory to use for the model cache (undefined = 'local_cache' default) */
  private cacheDir: string | undefined;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private flagEmbedding: any | undefined;

  /** In-flight initialization promise — prevents duplicate loads */
  private initPromise: Promise<void> | undefined;

  /** Model string identifier */
  private model: string;

  constructor(model = DEFAULT_MODEL, cacheDir?: string) {
    this.model = model;
    this.cacheDir = cacheDir;
  }

  /**
   * Embeds a batch of texts and returns one L2-normalized Float32Array per text.
   */
  async embed(texts: string[]): Promise<Float32Array[]> {
    await this.ready();

    // embed() returns an AsyncGenerator that yields Float32Array[] batches.
    // Pass a small batchSize so peak memory scales with 32 texts at a time
    // rather than the default 256, keeping ONNX tensor sizes manageable.
    const results: Float32Array[] = [];
    for await (const batch of this.flagEmbedding.embed(
      texts,
      EMBEDDINGS_CONFIG.BATCH_SIZE,
    )) {
      for (const vec of batch) {
        results.push(vec instanceof Float32Array ? vec : new Float32Array(vec));
      }
    }
    return results;
  }

  /**
   * Lazily initializes the model and resolves once it is ready.
   * Subsequent calls return immediately.
   */
  async ready(): Promise<void> {
    if (this.flagEmbedding) {
      return;
    }
    if (!this.initPromise) {
      this.initPromise = this._init();
    }
    await this.initPromise;
  }

  /**
   * Internal one-time initialization
   */
  private async _init(): Promise<void> {
    // Dynamic import keeps this module optional — callers that never create
    // TransformersEmbeddingProvider pay no startup cost.
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { EmbeddingModel, ExecutionProvider, FlagEmbedding } = await import(
      'fastembed'
    );

    // Resolve model: use the provided string if it matches a known enum value,
    // otherwise fall back to AllMiniLML6V2.
    const resolvedModel = Object.values(EmbeddingModel).includes(
      this.model as never,
    )
      ? this.model
      : EmbeddingModel.AllMiniLML6V2;

    // maxLength controls the token sequence length used for padding. The
    // default is 512, which creates enormous ONNX tensors (batch × 512 × dims).
    // Tool names and descriptions are typically < 80 tokens, so 128 is ample
    // and reduces peak memory ~16x compared to the default.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.flagEmbedding = await (FlagEmbedding.init as any)({
      model: resolvedModel,
      executionProviders: [ExecutionProvider.CPU],
      maxLength: EMBEDDINGS_CONFIG.MAX_LENGTH,
      ...(this.cacheDir ? { cacheDir: this.cacheDir } : {}),
    });
  }
}
