import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

export const IDL_NB_IMAGE_COMPONENT_SELECTOR = 'idl-nb-image';

@Component({
  selector: IDL_NB_IMAGE_COMPONENT_SELECTOR,
  standalone: true,
  imports: [CommonModule],
  templateUrl: './idl-nb-image.component.html',
  styleUrls: ['./idl-nb-image.component.scss'],
})
export class IDLNBImageComponent {}
