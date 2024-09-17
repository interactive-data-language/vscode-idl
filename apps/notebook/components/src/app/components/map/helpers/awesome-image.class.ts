// ...

import { LayerContext, LayerProps } from '@deck.gl/core';
import { BitmapLayer, BitmapLayerProps } from '@deck.gl/layers';

import { ColorTransform } from './color-transform.class';
import { ImageDisplayOptions } from './color-transform.interface';

/**
 * Properties for our image
 */
interface IAwesomeImageProps {
  /**
   * The color transform class to use
   */
  colorTransform?: ColorTransform;
  /**
   * Options for displaying an image
   */
  colorTransformOptions?: ImageDisplayOptions;
}

export type AwesomeImageProps = Partial<
  IAwesomeImageProps & Required<BitmapLayerProps> & Required<LayerProps>
>;

/**
 * Extension of the BitmapLayer that allows you to set display of data
 * using web.gl shaders to adjust data display at a layer-level
 */
export class AwesomeImage extends BitmapLayer<IAwesomeImageProps> {
  /**
   * Color transform which manages shader and web.gl
   */
  private colorTransform = new ColorTransform();

  constructor(...propObjects: AwesomeImageProps[]) {
    super(...propObjects);

    // check if we have a color transform
    if (propObjects[1]?.colorTransform) {
      this.setColorTransform(propObjects[1].colorTransform);
    }
  }

  /**
   * Cleans up and stops listening to subscriptions to prevent memory leaks
   */
  override finalizeState(context: LayerContext): void {
    super.finalizeState(context);
  }

  /**
   * Updates the color transform of this tile layer
   */
  setColorTransform(ct: ColorTransform) {
    this.colorTransform = ct;
  }

  /**
   * Draw and pass in uniforms from filter
   */
  override draw(options: any) {
    super.draw({
      ...options,
      uniforms: {
        ...(options.uniforms || {}),
        ...this.colorTransform.options,
      },
    });
  }

  /**
   * Override shaders from our default filter
   */
  override getShaders() {
    return {
      ...super.getShaders(),
      ...this.colorTransform.shader,
    };
  }
}
AwesomeImage.layerName = 'AwesomeImage';
