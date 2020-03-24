import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActoreditComponent } from './actoredit.component';

describe('ActoreditComponent', () => {
  let component: ActoreditComponent;
  let fixture: ComponentFixture<ActoreditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActoreditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActoreditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
