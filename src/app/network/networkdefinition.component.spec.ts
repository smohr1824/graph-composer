import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NetworkdefinitionComponent } from './networkdefinition.component';

describe('NetworkdefinitionComponent', () => {
  let component: NetworkdefinitionComponent;
  let fixture: ComponentFixture<NetworkdefinitionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NetworkdefinitionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NetworkdefinitionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
