import { Component, OnInit } from '@angular/core';
import { IDLNotebookAnimationFromEncodedPNGs } from '@idl/notebooks/types';

import { BaseRendererComponent } from '../base-renderer.component';

export const IDL_NB_IMAGE_ANIMATOR_COMPONENT_SELECTOR = 'idl-nb-image-animator';

/**
 * Round a number to the nearest increment
 */
export function RoundToNearest(num: number, to: number) {
  return num === 0 ? 0 : Math.round(Math.max(num / to, 1)) * to;
}

@Component({
  selector: 'idl-nb-image-animator',
  templateUrl: './image-animator.component.html',
  styles: [
    `
      @import 'shared-styles.scss';

      .control-button {
        cursor: pointer;
      }
    `,
  ],
})
export class ImageAnimatorComponent
  extends BaseRendererComponent<IDLNotebookAnimationFromEncodedPNGs>
  implements OnInit
{
  /**
   * Image source with PNG encoding added
   */
  src = 'not set';

  /**
   * The current frame we are on
   */
  frame = 0;

  /**
   * Default interval in seconds
   */
  interval = 1000;

  /**
   * Multiplier for speed
   */
  multiplier = 1;

  /**
   * When we click fast forward or slow down, what do we do?
   */
  fastMultiplier = 2;

  /**
   * If we are paused or not
   */
  isPaused = false;

  /**
   * reference to current animation timeout
   */
  private _timeout!: any | undefined;

  /**
   * On init, set up our animation
   */
  ngOnInit(): void {
    if (this.hasData) {
      this.setSource();
      this.play();
    }
  }

  multiplierText() {
    return `${RoundToNearest(
      1 / this.multiplier,
      this.multiplier > 1 ? 0.1 : 1
    )}x`;
  }

  /**
   * If slider changes because user make it change
   */
  onInputChange(ev: Event) {
    this.frame = +(ev.target as HTMLInputElement).value;
    this.setSource();
  }

  /**
   * Label for the tooltip
   */
  label(value: number) {
    return `${value + 1}`;
  }

  /**
   * Sets a timeout to animate through our images
   */
  play() {
    // update flag
    this.isPaused = false;

    if (!this.hasData) {
      return;
    }

    // set image source
    this.setSource();

    this._timeout = setTimeout(() => {
      // clear timeout reference
      this._timeout = undefined;

      // increment frame number
      this.frame++;

      // if we reached our limit, start at zero
      if (this.frame >= this._embed.item.data.length) {
        this.frame = 0;
      }

      // set image source
      this.setSource();

      // animate again
      this.play();
    }, this.getInterval());
  }

  /**
   * Gets the interval time (in ms) given current parameters
   */
  getInterval() {
    return this.interval * this.multiplier;
  }

  /**
   * Pauses execution
   */
  pauseOrPlay() {
    if (!this.isPaused) {
      this.pause();
    } else {
      this.play();
    }
  }

  /**
   * Resets/stops timeout for next frame
   */
  pause() {
    this.isPaused = true;
    if (this._timeout !== undefined) {
      window.clearTimeout(this._timeout);
    }
  }

  /**
   * Sets image source to the latest image data
   */
  setSource() {
    if (this.hasData) {
      this.src = `data:image/png;base64,${this._embed.item.data[this.frame]}`;
    }
  }

  /**
   * Makes it play faster
   */
  speedUp() {
    this.pause();
    this.multiplier = Math.max((this.multiplier /= this.fastMultiplier), 0.125);
    this.play();
  }

  /**
   * Makes it play slower
   */
  slowDown() {
    this.pause();
    this.multiplier = Math.min((this.multiplier *= this.fastMultiplier), 2);
    this.play();
  }
}
