import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MaterialCssVarsService } from 'angular-material-css-vars';

import { VSCodeService } from './services/vscode.service';

// singleton services
@NgModule({
  declarations: [],
  imports: [CommonModule],
  providers: [VSCodeService, MaterialCssVarsService],
})
export class ServicesModule {}
