import { Component, OnInit, OnDestroy } from '@angular/core';
// NgRx-related state management
import { Store, select } from '@ngrx/store';
import * as fromLayers from './state';
import * as layerActions from './state/layer.actions';
import { takeWhile } from 'rxjs/operators';
import { ElementaryLayer } from '../shared/elementary-layer';

@Component({
  selector: 'app-layer',
  templateUrl: './layers.component.html',
  styleUrls: ['./layers.component.css']
})
export class LayersComponent implements OnInit, OnDestroy {
  title: string = 'Defined Elementary Layers';
  layer: ElementaryLayer;
  layers: ElementaryLayer[];
  private componentActive = true;
  constructor(private store: Store<fromLayers.ElementaryLayerState>) { }

  ngOnInit() {
    this.store.dispatch(new layerActions.LoadLayers('foo'));
    this.store.pipe(select(fromLayers.getLayers), takeWhile(()=>this.componentActive)).subscribe(layers => this.layers = layers);
    if (this.layers.length > 0) {
      this.layer = this.layers[0];
    }
  }

  ngOnDestroy() {
    this.componentActive = false;
  }

  selectLayer(layer: ElementaryLayer) {
    this.layer = layer;
  }

  deleteLayer(layer: ElementaryLayer) {
    this.store.dispatch(new layerActions.DeleteLayer(layer.coordinates));
  }


}
