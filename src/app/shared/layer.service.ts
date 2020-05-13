import { Injectable } from '@angular/core';
import { ElementaryLayer } from './elementary-layer';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LayerService {

  constructor() { }

  // eventually, go out to the remote service and load all the layers for the named graph,
  // caching them locally
  getLayers(): Observable<ElementaryLayer[]> {
    return of(LAYERS);
  }

  // get the layer corresponding to the concatenation/intersection of layersets (coords)
  // from local cache
  getLayer(coord:string): Observable<ElementaryLayer> {
    return of(LAYERS.find(x => x.coordinates === coord));
  }

  createLayer(layer: ElementaryLayer): Observable<ElementaryLayer> {
    const index = LAYERS.findIndex((lay:ElementaryLayer) => lay.coordinates === layer.coordinates);
    if (index === -1) {
      LAYERS = [...LAYERS, layer];  
    } 
    return of(layer);
  }

  updateLayer(layer: ElementaryLayer): Observable<ElementaryLayer> {
    const index = LAYERS.findIndex((lay:ElementaryLayer) => lay.coordinates === layer.coordinates);
    if (index != -1) {
      LAYERS = LAYERS.map((item, _) => item.coordinates == layer.coordinates ? layer : item);
      return of(layer);
    } else {
      return of(null);
    }
  }

  deleteLayer(coord: string): Observable<string> {
    const index = LAYERS.findIndex((lay:ElementaryLayer) => lay.coordinates === coord);
    if (index != -1) {
      LAYERS = LAYERS.filter((item, _) => item.coordinates != coord);
      return of(coord);
    } else {
      return of('layer not found');
    }
  }

  setLayers(layers: ElementaryLayer[]): Observable<ElementaryLayer[]> {
    LAYERS = layers;
    return of(layers);
  }

}  

let LAYERS: ElementaryLayer[] = [ ];
