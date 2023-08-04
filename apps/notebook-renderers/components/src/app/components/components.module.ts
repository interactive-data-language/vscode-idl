import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { MaterialModule } from '../material.module';
import { ImageComponent } from './image/image.component';
import { ImageAnimatorComponent } from './apps/notebook-renderers/components/src/app/components/image-animator/image-animator.component';

@NgModule({
  declarations: [ImageComponent, ImageAnimatorComponent],
  imports: [CommonModule, MaterialModule],
  exports: [ImageComponent],
})
export class ComponentsModule {}
