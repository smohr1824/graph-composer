import { ActionReducerMap, createFeatureSelector } from '@ngrx/store';

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

// Over time, it has become apparent that durable state will stay on the client in
// application local storage, and REST calls to the service will be made outside the NGRX
// framework. Consequently, we could have forgone the effects and the local type-specific
// services and done all the work in the reducers. We are storing state twice; once in NGRX
// and once in the services. We will leave this alone for now in case we need to migrate
// the REST calls.
export const reducers: ActionReducerMap<State> = {
    network: networkReducer.reducer,
    aspects: aspectReducer.reducer,
    actors: actorReducer.reducer,
    layers: layerReducer.reducer
}

