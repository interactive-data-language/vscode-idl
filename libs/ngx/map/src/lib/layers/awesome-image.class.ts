// ...

import { LayerContext, LayerProps } from '@deck.gl/core';
import { BitmapLayer, BitmapLayerProps } from '@deck.gl/layers';
import { copy } from 'fast-copy';

import {
  colorTransformUniforms,
  DEFAULT_IMAGE_DISPLAY,
  IMAGE_SHADER_INJECT,
  ImageDisplayOptions,
} from './shaders/image-shader.interface';

/**
 * Properties for our image
 */
interface IAwesomeImageProps {
  /**
   * Custom shader uniforms
   */
  uniforms: ImageDisplayOptions;
}

export type AwesomeImageProps = Partial<
  BitmapLayerProps & IAwesomeImageProps & LayerProps
>;

/**
 * Extension of the BitmapLayer that allows you to set display of data
 * using web.gl shaders to adjust data display at a layer-level
 */
export class AwesomeImage extends BitmapLayer<IAwesomeImageProps> {
  static override layerName = 'AwesomeImage';

  /**
   * Current shader uniforms
   */
  private uniforms = copy(DEFAULT_IMAGE_DISPLAY);

  constructor(...propObjects: AwesomeImageProps[]) {
    super(...propObjects);

    // Initialize uniforms from props if provided
    if (propObjects.length > 1 && propObjects[1].uniforms) {
      this.uniforms = { ...this.uniforms, ...propObjects[1].uniforms };
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
      inject: IMAGE_SHADER_INJECT,
    };
  }

  /**
   * Update shader uniforms
   */
  updateImageDisplay(options: Partial<ImageDisplayOptions>) {
    this.uniforms = { ...this.uniforms, ...options } as ImageDisplayOptions;
    this.setNeedsRedraw();
  }
}
