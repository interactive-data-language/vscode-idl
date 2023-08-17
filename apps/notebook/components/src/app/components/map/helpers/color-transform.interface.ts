/**
 * Data structure for display
 */
export interface ImageDisplayOptions {
  /**
   * Gamma
   */
  gamma: number;
  /**
   * Brightness of image
   */
  brightness: number;
  /**
   * Contrast of image
   */
  contrast: number;
  /**
   * Saturation of image
   */
  saturation: number;
  /**
   * Scale for red
   */
  red: number;
  /**
   * Scale for green
   */
  green: number;
  /**
   * Scale for blue
   */
  blue: number;
}

export const DEFAULT_IMAGE_DISPLAY: ImageDisplayOptions = {
  gamma: 1.0, // [1,2]
  brightness: 1.0, // [0,1]
  contrast: 1.0, // [1,2]
  saturation: 1.0, // [1,2]
  red: 1.0,
  green: 1.0,
  blue: 1.0,
};
