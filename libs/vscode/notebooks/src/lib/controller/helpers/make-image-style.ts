/**
 * Creates a style string of CSS to embed in our HTML image elements
 */
export function MakeImageStyle(width: number, height: number) {
  return `style="width:100%;height:auto;max-width:${width}px;max-height:${height}px;aspect-ratio:1;"`;
}
