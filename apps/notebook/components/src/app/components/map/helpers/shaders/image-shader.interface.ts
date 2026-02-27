/**
 * Data structure for display
 */
export interface ImageDisplayOptions {
  [key: string]: number;
  /**
   * Scale for blue
   */
  blue: number;
  /**
   * Brightness of image
   */
  brightness: number;
  /**
   * Contrast of image
   */
  contrast: number;
  /**
   * Gamma
   */
  gamma: number;
  /**
   * Scale for green
   */
  green: number;
  /**
   * Scale for red
   */
  red: number;
  /**
   * Saturation of image
   */
  saturation: number;
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

/**
 * Shader module for custom color transform uniforms
 */
export const colorTransformUniforms = {
  name: 'colorTransform',
  fs: `uniform colorTransformUniforms {
  float gamma;
  float contrast;
  float saturation;
  float brightness;
  float red;
  float green;
  float blue;
} colorTransform;
`,
  uniformTypes: {
    gamma: 'f32',
    contrast: 'f32',
    saturation: 'f32',
    brightness: 'f32',
    red: 'f32',
    green: 'f32',
    blue: 'f32',
  },
};

/**
 * Fragment shader code for custom image color manipulation
 */
export const FRAGMENT_SHADER_INJECT = `
// Main color manipulation function
vec4 applyColorTransform(vec4 color) {
  vec3 rgb = color.rgb;
  
  // Apply gamma correction (default 1.0 = no change)
  rgb = pow(rgb, vec3(1.0 / colorTransform.gamma));
  
  // Apply saturation (default 1.0 = no change)
  float luma = dot(rgb, vec3(0.2125, 0.7154, 0.0721));
  rgb = mix(vec3(luma), rgb, colorTransform.saturation);
  
  // Apply contrast around midpoint 0.5 (default 1.0 = no change)
  rgb = (rgb - 0.5) * colorTransform.contrast + 0.5;
  
  // Apply RGB channel multipliers (default 1.0 = no change)
  rgb.r *= colorTransform.red;
  rgb.g *= colorTransform.green;
  rgb.b *= colorTransform.blue;
  
  // Apply brightness multiplier (default 1.0 = no change)
  rgb *= colorTransform.brightness;
  
  // Clamp to valid range
  rgb = clamp(rgb, 0.0, 1.0);
  
  color.rgb = rgb;
  return color;
}`;

/**
 * Apply transform
 */
export const FILTER_COLOR_INJECT = `color = applyColorTransform(color);`;

/**
 * Shader code to inject
 */
export const IMAGE_SHADER_INJECT = {
  'fs:#decl': FRAGMENT_SHADER_INJECT,
  'fs:DECKGL_FILTER_COLOR': FILTER_COLOR_INJECT,
};
