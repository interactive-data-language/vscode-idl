import { AfterViewInit, Component, ElementRef } from '@angular/core';

/**
 * ID for notebook image selector
 */
export const IDL_NB_IMAGE_COMPONENT_SELECTOR = 'idl-nb-image';

@Component({
  selector: 'idl-nb-image',
  templateUrl: './image.component.html',
  styles: [``],
})
export class ImageComponent implements AfterViewInit {
  /**
   * Note to display
   */
  note = 'We got and drew to our canvas!';

  /**
   * Reference to our canvas
   */
  canvas!: HTMLCanvasElement | null;

  constructor(private el: ElementRef<HTMLElement>) {}

  ngAfterViewInit() {
    try {
      this.canvas = this.el.nativeElement.querySelector('#myCanvas');

      if (this.canvas) {
        const ctx = this.canvas.getContext('2d');
        if (ctx !== null) {
          ctx.font = '30px Arial';
          ctx.strokeText('Hello World', 10, 50);
        } else {
          this.note = 'No 2d context for canvas';
        }
      } else {
        this.note = 'No canvas found';
      }
    } catch (err) {
      this.note = (err as Error).message;
    }
  }
}
