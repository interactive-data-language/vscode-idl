import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSliderModule } from '@angular/material/slider';
import { MatTableModule } from '@angular/material/table';
import { FlexLayoutModule } from '@ngbracket/ngx-layout';

const modules = [
  MatIconModule,
  MatButtonModule,
  MatSliderModule,
  MatTableModule,
  FlexLayoutModule,
];

@NgModule({
  imports: modules,
  exports: modules,
  providers: [],
})
export class MaterialModule {}
