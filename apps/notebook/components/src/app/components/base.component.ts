import { Component, OnInit } from '@angular/core';
import { MaterialCssVarsService } from 'angular-material-css-vars';

@Component({
  selector: 'idl-base',
  template: ` <p>base works!</p> `,
  styles: [],
})
export class BaseComponent implements OnInit {
  constructor(public materialCssVarsService: MaterialCssVarsService) {}

  ngOnInit() {
    // set some colors on load
    this.updateTheme();
  }

  /**
   * Updates the theme based on current CSS variables
   */
  updateTheme() {
    // get the body element
    const body = document.body;

    // get css class list
    const classes = body.classList;

    // flag if dark mode
    const isDark = !classes.contains('vscode-light');

    // get our colors
    const accent = getComputedStyle(body).getPropertyValue(
      '--vscode-activityBarBadge-background'
    );

    // set colors/themes/properties
    this.materialCssVarsService.setDarkTheme(isDark);
    // this.materialCssVarsService.setPrimaryColor(hex);
    this.materialCssVarsService.setAccentColor(accent);
  }
}
