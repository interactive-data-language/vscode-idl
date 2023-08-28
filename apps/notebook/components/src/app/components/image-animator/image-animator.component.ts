import { Component, OnInit } from '@angular/core';
import { IDLNotebookImage_AnimationFromPNGs } from '@idl/notebooks/types';

import { BaseRendererComponent } from '../base-renderer.component';

export const IDL_NB_IMAGE_ANIMATOR_COMPONENT_SELECTOR = 'idl-nb-image-animator';

/**
 * Round a number to the nearest increment
 */
export function RoundToNearest(num: number, to: number) {
  return num === 0 ? 0 : Math.round(Math.max(num / to, 1)) * to;
}

/**
 * Component that displays an animation from multiple PNG frames
 */
@Component({
  selector: 'idl-nb-image-animator',
  templateUrl: './image-animator.component.html',
  styles: [
    `
      @import 'shared-styles.scss';
    `,
  ],
})
export class ImageAnimatorComponent
  extends BaseRendererComponent<IDLNotebookImage_AnimationFromPNGs>
  implements OnInit
{
  /**
   * Image source with PNG encoding added
   */
  src = 'not set';

  /**
   * On init, set up our animation
   */
  ngOnInit(): void {
    if (this.hasData) {
      this.setSource(0);
    }
  }

  /**
   * Sets image source to the latest image data
   */
  setSource(frame: number) {
    if (this.hasData) {
      this.src = `data:image/png;base64,${this._embed.item.data[frame]}`;
    }
  }
}
