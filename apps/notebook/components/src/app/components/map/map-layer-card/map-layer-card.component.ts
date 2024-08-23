import { Component, EventEmitter, Input, Output } from '@angular/core';

import {
  NotebookMapLayer,
  NotebookMapLayerType,
} from '../helpers/create-layers.interface';

@Component({
  selector: 'idl-map-layer-card',
  templateUrl: './map-layer-card.component.html',
  styles: [
    `
      @import 'styles.scss';
    `,
  ],
})
export class MapLayerCardComponent {
  /**
   * The layer we are displaying
   */
  @Input() layer!: NotebookMapLayer<NotebookMapLayerType>;

  /**
   * Output event that is emitted when our frame changes
   */
  @Output() propChange = new EventEmitter<undefined>();

  /** Current opacity */
  opacity = 100;

  /**
   * When opacity slider changes, callback
   */
  onOpacityChange(ev: Event) {
    // convert to number
    this.opacity = +(ev.target as HTMLInputElement).value;

    // save property for opacity
    this.layer.props.opacity = this.opacity / 100;

    // emit event that we changed
    this.propChange.emit();
  }
}
