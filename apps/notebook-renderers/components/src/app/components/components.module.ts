import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { MaterialModule } from '../material.module';
import { ImageComponent } from './image/image.component';

@NgModule({
  declarations: [ImageComponent],
  imports: [CommonModule, MaterialModule],
  exports: [ImageComponent],
})
export class ComponentsModule {}
