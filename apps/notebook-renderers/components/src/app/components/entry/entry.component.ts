import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import {
  IDLNotebookEmbeddedItem,
  IDLNotebookEmbedType,
} from '@idl/notebooks/types';

/**
 * ID for notebook renderers entry component
 */
export const IDL_NB_ENTRY_COMPONENT_SELECTOR = 'idl-nb-entry';

/**
 * Entry components handles the logic of determining the right thing
 * to render and creates the correct type of element to display
 * the item that we are embedding in our data
 *
 * We are doing this here because it simplified the logic for our renderer and
 * allows us to use types. We can't use types when we are in the renderer function
 * because we use `tsc` to build which expects all dependencies to be
 * local (and we needed that to work around compiling it right to use as a notebook
 * renderer)
 */
@Component({
  selector: 'idl-nb-entry',
  templateUrl: './entry.component.html',
  styles: [
    `
      @import 'styles.scss';
    `,
  ],
})
export class EntryComponent implements OnInit, AfterViewInit {
  /**
   * Flag if we have data or not
   */
  hasData = false;

  /**
   * Data we are embedding, comes in as a raw string so we have to parse it
   */
  @Input()
  get data(): string {
    return JSON.stringify(this.embed);
  }
  set data(data: string) {
    this.embed = JSON.parse(data);
  }

  /**
   * Parsed data
   */
  embed!: IDLNotebookEmbeddedItem<IDLNotebookEmbedType>;

  ngOnInit() {
    const a = 5;
  }

  ngAfterViewInit() {
    if (this.embed !== undefined) {
      this.hasData = true;
    }
  }
}
