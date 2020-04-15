import { Node, Edge } from '../../shared/layerElements';
import { ElementaryLayer } from '../../shared/elementary-layer';
import { Action } from '@ngrx/store';

// Actions -- success/fail anticipates async call to remote service
// Aspects are passed as an immutable input when creating a ML FCM on the server, hence
// Aspect CRUD operations occur on the client-only
// Loading the set of aspects for an existing ML FCM is the only time the client
// will need to make an asynchronous call to the server, but create/delete/update also
// have to go through the service as it is maintaining local (to the client) state.
// As the server gets built out, the local service will determine when to hit the server 
// and when to serve from local cache
// Actions -- success/fail anticipates async call to remote service
// Aspects are passed as an immutable input when creating a ML FCM on the server, hence
// Aspect CRUD operations occur on the client-only
// Loading the set of aspects for an existing ML FCM is the only time the client
// will need to make an asynchronous call to the server, but create/delete/update also
// have to go through the service as it is maintaining local (to the client) state.
// As the server gets built out, the local service will determine when to hit the server 
// and when to serve from local cache
export enum LayerActionTypes {
    LoadLayers = '[Layer] Load',
    LoadLayersSuccess = '[Layer] Load Success',
    LoadLayersFailure = '[Layer] Load Failure',
    CreateLayer = '[Layer] Create Layer',
    CreateLayerSuccess = '[Layer] Create Layer Success',
    CreateLayerFailure = '[Layer] Create Layer Failure',
    DeleteLayer = '[Layer] Delete Layer',
    DeleteLayerSuccess = '[Layer] Delete Layer Success',
    DeleteLayerFailure = '[Layer] Delete Layer Failure',
    UpdateLayer = '[Layer] Update Layer',
    UpdateLayerSuccess = '[Layer] Update Layer Success',
    UpdateLayerFailure = '[Layer] Update Layer Failure',
    GetLayer = "[Layer] Get Layer",
    GetLayerSuccess = '[Layer] Get Layer Success',
    GetLayerFailure = '[Layer] Get Layer Failure'
    
}

// action class denoting an action only, i.e., no payload
export class LoadLayers implements Action {
    readonly type = LayerActionTypes.LoadLayers;

    constructor(public payload: string) { };
}

// action class involving a payload
export class LoadLayersSuccess implements Action {
    readonly type = LayerActionTypes.LoadLayersSuccess;

    constructor(public payload: ElementaryLayer[]) {}
}

export class LoadLayersFailure implements Action {
    readonly type = LayerActionTypes.LoadLayersFailure;

    constructor(public payload: string) { }
}

export class GetLayer implements Action {
    readonly type = LayerActionTypes.GetLayer;

    constructor(public payload: string) { };
}

export class GetLayerSuccess implements Action {
    readonly type = LayerActionTypes.GetLayerSuccess;

    constructor(public payload: ElementaryLayer) { };
}

export class GetLayerFailure implements Action {
    readonly type = LayerActionTypes.GetLayerFailure;

    constructor(public payload: string) { }
}

export class CreateLayer implements Action {
    readonly type = LayerActionTypes.CreateLayer;

    constructor(public payload: ElementaryLayer) { }
}

export class CreateLayerSuccess implements Action {
    readonly type = LayerActionTypes.CreateLayerSuccess;

    constructor(public payload: ElementaryLayer) { }
}

export class CreateLayerFailure implements Action {
    readonly type = LayerActionTypes.CreateLayerFailure;

    constructor(public payload: string) { }
}

export class DeleteLayer implements Action {
    readonly type = LayerActionTypes.DeleteLayer;

    constructor(public payload: string) { }
}

export class DeleteLayerSuccess implements Action {
    readonly type = LayerActionTypes.DeleteLayerSuccess;

    constructor(public payload: string) { }
}

export class DeleteLayerFailure implements Action {
    readonly type = LayerActionTypes.DeleteLayerFailure;

    constructor(public payload: string) { }
}

export class UpdateLayer implements Action {
    readonly type = LayerActionTypes.UpdateLayer;

    constructor(public payload: ElementaryLayer) { }
}

export class UpdateLayerSuccess implements Action {
    readonly type = LayerActionTypes.UpdateLayerSuccess;

    constructor(public payload: ElementaryLayer) { }
}

export class UpdateLayerFailure implements Action {
    readonly type = LayerActionTypes.UpdateLayerFailure;

    constructor(public payload: string) { }
}

export type LayerActions = LoadLayers
    | LoadLayers
    | LoadLayersSuccess
    | LoadLayersFailure
    | CreateLayer
    | CreateLayerSuccess
    | CreateLayerFailure
    | DeleteLayer
    | DeleteLayerSuccess
    | DeleteLayerFailure
    | UpdateLayer
    | UpdateLayerSuccess
    | UpdateLayerFailure
    | GetLayer
    | GetLayerSuccess
    | GetLayerFailure;