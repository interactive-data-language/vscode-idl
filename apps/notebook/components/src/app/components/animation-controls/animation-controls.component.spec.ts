import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnimationControlsComponent } from './animation-controls.component';

describe('AnimationControlsComponent', () => {
  let component: AnimationControlsComponent;
  let fixture: ComponentFixture<AnimationControlsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AnimationControlsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AnimationControlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
