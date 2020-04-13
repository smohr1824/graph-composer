import { createFeatureSelector, createSelector } from '@ngrx/store';
import { Node, Edge } from '../../shared/layerElements';
import { ElementaryLayer } from '../../shared/elementary-layer';

export interface ElementaryLayerState {
    layers: ElementaryLayer[];
    error: string;
}

// Selector functions
const getLayerFeatureState = createFeatureSelector<ElementaryLayerState>('layers');

export const getElementaryLayer = createSelector(
    getLayerFeatureState,
    (state, props) => 
      {return state.layers.find(l => l.coordinates === props.coords)}
  )

export const getAspects = createSelector(
    getLayerFeatureState,
    state => state.layers
)  