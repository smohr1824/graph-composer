import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RunLayersComponent } from './run-layers.component';

describe('RunLayersComponent', () => {
  let component: RunLayersComponent;
  let fixture: ComponentFixture<RunLayersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RunLayersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RunLayersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
