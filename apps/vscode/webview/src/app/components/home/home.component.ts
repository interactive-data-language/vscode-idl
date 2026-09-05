import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, inject } from '@angular/core';
import { TranslocoModule } from '@jsverse/transloco';

import { MaterialModule } from '../../material.module';
import { VSCodeService } from '../../services/services/vscode.service';

@Component({
  selector: 'idlwv-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
  imports: [CommonModule, MaterialModule, TranslocoModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class HomeComponent {
  vscode = inject(VSCodeService);

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
