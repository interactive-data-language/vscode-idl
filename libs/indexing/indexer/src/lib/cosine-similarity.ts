/**
 * Computes the dot product of two L2-normalized Float32Arrays.
 *
 * When both vectors are L2-normalized (unit length), dot product equals
 * cosine similarity. The embedding provider contract guarantees normalized
 * output, so this is the correct and efficient similarity measure.
 */
export function CosineSimilarity(a: Float32Array, b: Float32Array): number {
  let sum = 0;
  for (let i = 0; i < a.length; i++) {
    sum += a[i] * b[i];
  }
  return sum;
}
