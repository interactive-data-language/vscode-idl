/**
 * Configuration for embeddings
 */
export const EMBEDDINGS_CONFIG = {
  /**
   * Maximum token sequence length passed to the ONNX model.
   *
   * Tool descriptions are limited to 1,000 characters (~150-200 tokens) by
   * GetCleanDescription(). 256 tokens captures the full first paragraph of
   * all but the most verbose descriptions without the memory cost of the 512
   * default (tensor size scales linearly with this value).
   */
  MAX_LENGTH: 256,
  /**
   * Number of texts processed in one ONNX forward pass.
   *
   * Peak memory per batch = BATCH_SIZE x MAX_LENGTH x 4 bytes x 3 input tensors.
   * At 32 x 256 that is ~96 MB, well within reason on any modern machine.
   */
  BATCH_SIZE: 16,
};
