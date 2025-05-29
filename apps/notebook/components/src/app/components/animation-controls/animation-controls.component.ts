import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

/**
 * Round a number to the nearest increment
 */
export function RoundToNearest(num: number, to: number) {
  return num === 0 ? 0 : Math.round(Math.max(num / to, 1)) * to;
}

@Component({
  selector: 'idl-nb-animation-controls',
  templateUrl: './animation-controls.component.html',
  styles: [
    `
      @import 'styles.scss';
    `,
  ],
  standalone: false,
})
export class AnimationControlsComponent implements OnInit {
  /**
   * When we click fast forward or slow down, what do we do?
   */
  fastMultiplier = 2;

  /**
   * The current frame we are on
   */
  frame = 0;

  /**
   * Output event that is emitted when our frame changes
   */
  @Output() frameChange = new EventEmitter<number>();

  /**
   * Animation interval (ms)
   */
  @Input() interval = 1000;

  /**
   * If we are paused or not
   */
  isPaused = false;

  /**
   * Multiplier for speed
   */
  multiplier = 1;

  /**
   * The maximum number of frames that we have
   */
  @Input() nFrames = 1;

  /**
   * reference to current animation timeout
   */
  private _timeout!: any | undefined;

  /**
   * Gets the interval time (in ms) given current parameters
   */
  getInterval() {
    return this.interval * this.multiplier;
  }

  /**
   * Label for the tooltip
   */
  label(value: number) {
    return `${value + 1}`;
  }

  /**
   * Get text for our video speed
   */
  multiplierText() {
    return `${RoundToNearest(
      1 / this.multiplier,
      this.multiplier > 1 ? 0.1 : 1
    )}x`;
  }

  ngOnInit() {
    this.play();
  }

  /**
   * If slider changes because user make it change
   */
  onInputChange(ev: Event) {
    // update our tracked frame
    this.frame = +(ev.target as HTMLInputElement).value;

    // emit event
    this.frameChange.next(this.frame);
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
   * Sets a timeout to animate through our images
   */
  play() {
    // update flag
    this.isPaused = false;

    this._timeout = setTimeout(() => {
      // clear timeout reference
      this._timeout = undefined;

      // increment frame number
      this.frame++;

      // if we reached our limit, start at zero
      if (this.frame >= this.nFrames) {
        this.frame = 0;
      }

      // emit event
      this.frameChange.next(this.frame);

      // animate again
      this.play();
    }, this.getInterval());
  }

  /**
   * Makes it play slower
   */
  slowDown() {
    this.pause();
    this.multiplier = Math.min((this.multiplier *= this.fastMultiplier), 2);
    this.play();
  }

  /**
   * Makes it play faster
   */
  speedUp() {
    this.pause();
    this.multiplier = Math.max((this.multiplier /= this.fastMultiplier), 0.125);
    this.play();
  }
}
