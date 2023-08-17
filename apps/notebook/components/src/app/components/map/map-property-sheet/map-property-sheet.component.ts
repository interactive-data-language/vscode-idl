import { Component, Input, OnInit } from '@angular/core';

/**
 * ID for notebook map property sheet
 */
export const IDL_NB_MAP_PROPERTY_SHEET_SELECTOR = 'idl-nb-map-property-sheet';

@Component({
  selector: 'idl-nb-map-property-sheet',
  templateUrl: './map-property-sheet.component.html',
  styles: [
    `
      @import 'shared-styles.scss';

      table.property-sheet {
        max-height: 150px !important;
      }

      .compact-rows {
        margin-top: -10px !important;
        margin-bottom: -10px !important;
      }
    `,
  ],
})
export class MapPropertySheetComponent implements OnInit {
  /**
   * Columns we display in the table
   */
  displayedColumns: string[] = ['name', 'value'];

  /**
   * Data that we display
   */
  dataSource: { name: string; value: any }[] = [];

  /**
   * Properties (as string) that we need to render
   */
  @Input() properties = '{}';

  ngOnInit() {
    // parse data so we can render it
    try {
      const parsed = JSON.parse(this.properties);
      const keys = Object.keys(parsed);
      for (let i = 0; i < keys.length; i++) {
        this.dataSource.push({ name: keys[i], value: parsed[keys[i]] });
      }
    } catch (err) {
      console.error(err);
    }
  }
}
