// ...

import { LayerContext, LayerProps } from '@deck.gl/core';
import { BitmapLayer, BitmapLayerProps } from '@deck.gl/layers';

import { ImageDisplayOptions } from './color-transform.interface';

/**
 * Properties for our image
 */
interface IAwesomeImageProps {
  /**
   * Custom shader uniforms
   */
  shaderUniforms?: ImageDisplayOptions;
}

export type AwesomeImageProps = Partial<
  BitmapLayerProps & IAwesomeImageProps & LayerProps
>;

/**
 * Shader module for custom color transform uniforms
 */
const colorTransformUniforms = {
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
const FRAGMENT_SHADER_INJECT = `
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
 * Extension of the BitmapLayer that allows you to set display of data
 * using web.gl shaders to adjust data display at a layer-level
 */
export class AwesomeImage extends BitmapLayer<IAwesomeImageProps> {
  static override layerName = 'AwesomeImage';

  /**
   * Current shader uniforms
   */
  private uniforms: ImageDisplayOptions = {
    gamma: 1.0, // [1,2]
    brightness: 1.0, // [0,1]
    contrast: 1.0, // [1,2]
    saturation: 1.0, // [1,2]
    red: 1.0,
    green: 1.0,
    blue: 1.0,
  };

  constructor(...propObjects: AwesomeImageProps[]) {
    super(...propObjects);

    // Initialize uniforms from props if provided
    if (propObjects.length > 1 && propObjects[1].shaderUniforms) {
      this.uniforms = { ...this.uniforms, ...propObjects[1].shaderUniforms };
    }
  }

  /**
   * Draw and pass in uniforms from filter
   */
  override draw(options: any) {
    const { model } = this.state;

    if (model) {
      // Set uniforms using shader module pattern (deck.gl 9.x)
      model.shaderInputs.setProps({
        colorTransform: this.uniforms,
      });
    }

    super.draw(options);
  }

  /**
   * Cleans up and stops listening to subscriptions to prevent memory leaks
   */
  override finalizeState(context: LayerContext): void {
    super.finalizeState(context);
  }

  /**
   * Override getShaders to inject custom fragment shader code
   */
  override getShaders() {
    const parentShaders = super.getShaders();

    return {
      ...parentShaders,
      modules: [...(parentShaders.modules || []), colorTransformUniforms],
      inject: {
        'fs:#decl': FRAGMENT_SHADER_INJECT,
        'fs:DECKGL_FILTER_COLOR': `color = applyColorTransform(color);`,
      },
    };
  }

  // /**
  //  * Get current shader uniforms
  //  */
  // getShaderUniforms(): ImageDisplayOptions {
  //   return { ...this.uniforms };
  // }

  // /**
  //  * Reset shader uniforms to default values
  //  */
  // resetShaderUniforms() {
  //   this.uniforms = copy(DEFAULT_IMAGE_DISPLAY);
  //   this.setNeedsRedraw();
  // }

  /**
   * Update shader uniforms
   */
  updateImageDisplay(options: Partial<ImageDisplayOptions>) {
    this.uniforms = { ...this.uniforms, ...options } as ImageDisplayOptions;
    this.setNeedsRedraw();
  }
}
