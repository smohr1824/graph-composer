import { ActionReducerMap } from '@ngrx/store';

import { AspectState } from '../aspects/state';
import { ActorState } from '../actors/state';
import { ElementaryLayerState } from '../layers/state';

import * as aspectReducer from '../aspects/state/aspect.reducer';
import * as actorReducer from '../actors/state/actor.reducer';
import * as layerReducer from '../layers/state/layer.reducer';


export interface State {
    aspects: AspectState;
    actors: ActorState;
    layers: ElementaryLayerState;
}

export const reducers: ActionReducerMap<State> = {
    aspects: aspectReducer.reducer,
    actors: actorReducer.reducer,
    layers: layerReducer.reducer
}