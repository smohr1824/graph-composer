import { ActionReducerMap } from '@ngrx/store';

import { AspectState } from '../aspects/state';
import { ActorState } from '../actors/state';
import { ElementaryLayerState } from '../layers/state';
import { NetworkState } from '../network/state';

import * as aspectReducer from '../aspects/state/aspect.reducer';
import * as actorReducer from '../actors/state/actor.reducer';
import * as layerReducer from '../layers/state/layer.reducer';
import * as networkReducer from '../network/state/network.reducer';


export interface State {
    network: NetworkState
    aspects: AspectState;
    actors: ActorState;
    layers: ElementaryLayerState;
}

export const reducers: ActionReducerMap<State> = {
    network: networkReducer.reducer,
    aspects: aspectReducer.reducer,
    actors: actorReducer.reducer,
    layers: layerReducer.reducer
}