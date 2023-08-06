import { Component, Input } from '@angular/core';
import {
  IDLNotebookAnimationFromEncodedPNGs,
  IDLNotebookEmbeddedItem,
  IDLNotebookEmbedType,
} from '@idl/notebooks/types';

export const IDL_NB_IMAGE_ANIMATOR_COMPONENT_SELECTOR = 'idl-nb-image-animator';

@Component({
  selector: 'idl-nb-image-animator',
  templateUrl: './image-animator.component.html',
  styles: [
    `
      .controls {
        /* background: rgba(var(--vscode-editor-background), 0.8); */
        background: var(--vscode-editor-background);
        /* opacity: 85%; */
      }
    `,
  ],
})
export class ImageAnimatorComponent {
  /**
   * Track if we set data or not
   */
  hasData = false;

  /**
   * Item we are embedding
   *
   * Use set to we can properly type because the ngSwitch case does not
   * handle it well
   */
  @Input()
  set embed(item: IDLNotebookEmbeddedItem<IDLNotebookEmbedType>) {
    this._embed =
      item as IDLNotebookEmbeddedItem<IDLNotebookAnimationFromEncodedPNGs>;
    this.setSource();
    this.hasData = true;
    this.animate();
  }

  /**
   * Image source with PNG encoding added
   */
  src = 'not set';

  /**
   * Parsed data
   */
  _embed!: IDLNotebookEmbeddedItem<IDLNotebookAnimationFromEncodedPNGs>;

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
   * Sets a timeout to animate through our images
   */
  animate() {
    if (!this.hasData) {
      return;
    }

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
      this.animate();
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
    this.isPaused = !this.isPaused;

    // if we are paused, stop any pending timeouts
    if (this.isPaused) {
      this.resetOrStop();
    } else {
      this.animate();
    }
  }

  /**
   * Resets/stops timeout for next frame
   */
  resetOrStop() {
    if (this._timeout !== undefined) {
      window.clearTimeout(this._timeout);
    }
  }

  /**
   * Sets image source to the latest image data
   */
  setSource() {
    this.src = `data:image/png;base64,${this._embed.item.data[this.frame]}`;
  }

  /**
   * Makes it play faster
   */
  speedUp() {
    this.resetOrStop();
    this.multiplier = Math.max((this.multiplier /= this.fastMultiplier), 0.125);
    this.animate();
  }

  /**
   * Makes it play slower
   */
  slowDown() {
    this.resetOrStop();
    this.multiplier = Math.min((this.multiplier /= this.fastMultiplier), 8);
    this.animate();
  }
}
