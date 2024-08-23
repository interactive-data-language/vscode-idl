import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { FlexLayoutModule } from '@ngbracket/ngx-layout';

const modules = [MatIconModule, MatTableModule, FlexLayoutModule];

@NgModule({
  imports: modules,
  exports: modules,
  providers: [],
})
export class MaterialModule {}
