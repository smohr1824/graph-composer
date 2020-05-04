import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RunAggregateComponent } from './run-aggregate.component';

describe('RunAggregateComponent', () => {
  let component: RunAggregateComponent;
  let fixture: ComponentFixture<RunAggregateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RunAggregateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RunAggregateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
