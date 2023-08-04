import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ImageComponent } from './image/image.component';

@NgModule({
  declarations: [ImageComponent],
  imports: [CommonModule],
  exports: [ImageComponent],
})
export class ComponentsModule {}
