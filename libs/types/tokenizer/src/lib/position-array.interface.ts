/**
 * Describes token position as an array. The elements represent
 * the `[line, index, length]` of a token.
 */
export type PositionArray = [number, number, number];

/** POsition range */
export interface PositionRange {
  /** Where does the container for our token end? i.e. the "end" for our procedure */
  end?: PositionArray;
  /** Where does the container for our token start? i.e. "pro" for procedure */
  start: PositionArray;
}
