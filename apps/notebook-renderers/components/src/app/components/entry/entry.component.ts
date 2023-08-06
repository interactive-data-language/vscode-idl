import { AfterViewInit, Component, ElementRef, Input } from '@angular/core';
import {
  IDLNotebookEmbeddedItem,
  IDLNotebookEmbedType,
} from '@idl/notebooks/types';

/**
 * ID for notebook renderers entry component
 */
export const IDL_NB_ENTRY_COMPONENT_SELECTOR = 'idl-nb-entry';

@Component({
  selector: 'idl-nb-entry',
  templateUrl: './entry.component.html',
  styles: [
    `
      @import 'styles.scss';
    `,
  ],
})
export class EntryComponent implements AfterViewInit {
  /**
   * Flag if we have data or not
   */
  hasData = false;

  @Input()
  get data(): string {
    return JSON.stringify(this.embed);
  }
  set data(data: string) {
    this.embed = JSON.parse(data);
    this.hasData = true;
  }

  /**
   * Parsed data
   */
  embed!: IDLNotebookEmbeddedItem<IDLNotebookEmbedType>;

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
