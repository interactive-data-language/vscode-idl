// ...

import { TileLayer } from '@deck.gl/geo-layers/typed';

import { ColorTransform } from './color-transform.class';
import { ImageDisplayOptions } from './color-transform.interface';

/**
 * DOESNT WORK
 *
 * But the goal is to do the same thing we did with the BitmapLayer to the
 * overall tile layer, but im not sure we can do that
 */
export class AwesomeTileLayer extends TileLayer {
  /**
   * Color transform which manages shader and web.gl
   */
  private color = new ColorTransform();

  /**
   * Update the image display
   */
  updateImageDisplay(opts: Partial<ImageDisplayOptions>) {
    this.color.update(opts);
    this.setNeedsRedraw();
  }

  /**
   * Draw and pass in uniforms from filter
   */
  override draw(options: any) {
    super.draw({
      ...options,
      uniforms: {
        ...(options.uniforms || {}),
        ...this.color.options,
      },
    });
  }

  /**
   * Override shaders from our default filter
   */
  override getShaders(shaders: any) {
    return {
      ...super.getShaders(shaders),
      ...this.color.shader,
    };
  }
}
AwesomeTileLayer.layerName = 'AwesomeTileLayer';
