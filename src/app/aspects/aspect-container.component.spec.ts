import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AspectContainerComponent } from './aspect-container.component';

describe('AspectContainerComponent', () => {
  let component: AspectContainerComponent;
  let fixture: ComponentFixture<AspectContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AspectContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AspectContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
