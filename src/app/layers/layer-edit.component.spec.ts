import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LayerEditComponent } from './layer-edit.component';

describe('LayerEditComponent', () => {
  let component: LayerEditComponent;
  let fixture: ComponentFixture<LayerEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LayerEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LayerEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
