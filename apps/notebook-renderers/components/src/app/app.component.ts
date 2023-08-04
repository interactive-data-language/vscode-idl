import { Component } from '@angular/core';

@Component({
  selector: 'idl-notebook-components',
  templateUrl: './app.component.html',
  // styleUrls: ['./app.component.scss'],
  styles: [
    `
      .idl-nb-image {
        color: red !important;
        font-style: italic !important;
        background-color: aqua !important;
      }
    `,
  ],
})
export class AppComponent {
  title = 'Notebook Components';
}
