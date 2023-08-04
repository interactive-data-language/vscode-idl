import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageAnimatorComponent } from './image-animator.component';

describe('ImageAnimatorComponent', () => {
  let component: ImageAnimatorComponent;
  let fixture: ComponentFixture<ImageAnimatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ImageAnimatorComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ImageAnimatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
