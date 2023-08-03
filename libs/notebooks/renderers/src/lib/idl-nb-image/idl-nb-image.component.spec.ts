import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IDLNBImageComponent } from './idl-nb-image.component';

describe('IDLNBImageComponent', () => {
  let component: IDLNBImageComponent;
  let fixture: ComponentFixture<IDLNBImageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IDLNBImageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(IDLNBImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
