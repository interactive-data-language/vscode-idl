import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Plot2DComponent } from './plot2d.component';

describe('Plot2DComponent', () => {
  let component: Plot2DComponent;
  let fixture: ComponentFixture<Plot2DComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Plot2DComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(Plot2DComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
