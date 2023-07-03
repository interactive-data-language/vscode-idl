import { Component } from '@angular/core';

import { VSCodeService } from '../../../services/services/vscode.service';

@Component({
  selector: 'idlwv-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  constructor(public vscode: VSCodeService) {}

  /**
   * Flips the flag that we show our UI on startup
   */
  flipStartupFlag() {
    // flip flag
    this.vscode.dontShowOnStartup = !this.vscode.dontShowOnStartup;

    // send message
    this.vscode.vscodeApi.postMessage({
      command: 'show-on-startup-setting',
      data: this.vscode.dontShowOnStartup,
    });
  }
}
