import { ElementaryLayer } from '../../shared/elementary-layer';
import { LayerActionTypes, LayerActions } from './layer.actions';
import * as fromLayers from '.';

let LAYERS = [];

const initialState = {
    layers: LAYERS,
    error: ''
}

export function reducer(state = initialState, action: LayerActions): fromLayers.ElementaryLayerState {
  console.log('layer reducer: ' + action.type)
  switch(action.type) {
      case LayerActionTypes.LoadLayersSuccess:
        return {
          ...state,
          layers: action.payload,
          error: ''
        };

      case LayerActionTypes.LoadLayersFailure:
        return {
          ...state,
          layers: [],
          error: action.payload

        }

      case LayerActionTypes.DeleteLayerSuccess:
        return {
          ...state,
          layers: state.layers.filter(actor => actor.coordinates !== action.payload),
          error: ''
        };

      case LayerActionTypes.DeleteLayerFailure:
        return {
          ...state,
          error: action.payload
        }

      case LayerActionTypes.UpdateLayerSuccess:
        return {
          ...state,
          layers: state.layers.map(
            (item: ElementaryLayer) => action.payload.coordinates == item.coordinates ? action.payload : item),
          error: ''
        };

      case LayerActionTypes.UpdateLayerFailure:
        return {
          ...state,
          error: action.payload
        }

      case LayerActionTypes.CreateLayerSuccess:
        let s = state.layers;
        console.log('in layer reducer for create layer')
        return {
          ...state,
          layers: [...s, action.payload],
          error: ''
        }

      default:
        return state;
    }
}