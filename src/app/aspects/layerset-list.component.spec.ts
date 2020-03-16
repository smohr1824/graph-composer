import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LayersetListComponent } from './layerset-list.component';

describe('LayersetListComponent', () => {
  let component: LayersetListComponent;
  let fixture: ComponentFixture<LayersetListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LayersetListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LayersetListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
