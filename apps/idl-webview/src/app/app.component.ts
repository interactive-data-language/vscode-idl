import { Component, HostBinding, OnInit } from '@angular/core';
import { DEFAULT_VSCODE_MESSAGE } from '@idl/vscode/webview-shared';
import { MaterialCssVarsService } from 'angular-material-css-vars';

import { VSCodeService } from './services/services/vscode.service';

@Component({
  selector: 'idlwv-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  // theming
  @HostBinding('class') activeThemeCssClass!: string;

  title = 'idl-webview';
  message = { ...DEFAULT_VSCODE_MESSAGE };

  constructor(
    public materialCssVarsService: MaterialCssVarsService,
    private vscodeService: VSCodeService
  ) {}

  ngOnInit() {
    // listen for color changes
    this.vscodeService.newTheme.subscribe((changed) => {
      if (changed) {
        this.updateTheme();
      }
    });

    // isten for messages - used for "routing"
    this.vscodeService.messages.subscribe((msg) => {
      this.message = msg;
    });

    // set some colors on load
    this.updateTheme();
  }

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
