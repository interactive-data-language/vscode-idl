import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { IDLNBImageComponent } from './idl-nb-image/idl-nb-image.component';

@NgModule({
  imports: [CommonModule],
  declarations: [IDLNBImageComponent],
  exports: [IDLNBImageComponent],
})
export class NotebooksRenderersModule {}
