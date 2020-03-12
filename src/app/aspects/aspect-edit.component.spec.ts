import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AspectEditComponent } from './aspect-edit.component';

describe('AspectEditComponent', () => {
  let component: AspectEditComponent;
  let fixture: ComponentFixture<AspectEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AspectEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AspectEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
