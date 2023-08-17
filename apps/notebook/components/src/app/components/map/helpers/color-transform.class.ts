import copy from 'fast-copy';

import {
  DEFAULT_IMAGE_DISPLAY,
  ImageDisplayOptions,
} from './color-transform.interface';

/**
 * Helpful links:
 *
 * Tutorial that helped get pieces together:
 *   https://observablehq.com/@pessimistress/deck-gl-shader-injection
 *
 * Docs for what comes along with different injection points:
 *   https://deck.gl/docs/developer-guide/custom-layers/writing-shaders
 */

/**
 * Declarations for fragment shader
 */
const FS_DECL = `
// color matrix from pixi.js AdjustmentFilter
uniform float gamma;
uniform float contrast;
uniform float saturation;
uniform float brightness;
uniform float red;
uniform float green;
uniform float blue;
`;

/**
 * WebGL code for color transform,
 *
 * From the `this.filter._program` property in the ColorTransform class and modified
 * to work with deck.fl which has a placeholder `color` variable which you can find
 * in the docs here: https://deck.gl/docs/developer-guide/custom-layers/writing-shaders#fsdeckgl_filter_color
 */
const COLOR = `
// color matrix code from pixi.js AdjustmentFilter
vec3 rgb = pow(color.rgb, vec3(1. / gamma));
rgb = mix(vec3(.5), mix(vec3(dot(vec3(.2125, .7154, .0721), rgb)), rgb, saturation), contrast);
rgb.r *= red;
rgb.g *= green;
rgb.b *= blue;
color.rgb = rgb * brightness;
`;

/**
 * Class that manages creating and applying a color transform to a dataset
 */
export class ColorTransform {
  /**
   * Image display options
   */
  options = copy(DEFAULT_IMAGE_DISPLAY);

  /**
   * Shader that we inject into deck.gl
   */
  shader = {
    inject: {
      'fs:#decl': FS_DECL,
      'fs:DECKGL_FILTER_COLOR': COLOR,
    },
  };

  constructor(opts: Partial<ImageDisplayOptions> = {}) {
    Object.assign(this.options, opts);
  }

  /**
   * Update color transform properties
   */
  update(opts: Partial<ImageDisplayOptions>) {
    Object.assign(this.options, opts);
  }
}
