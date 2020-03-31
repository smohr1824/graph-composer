import { Aspect } from '../../shared/aspect';
import { Action } from '@ngrx/store';

// Actions -- success/fail anticipates async call to remote service
// Aspects are passed as an immutable input when creating a ML FCM on the server, hence
// Aspect CRUD operations occur on the client-only
// Loading the set of aspects for an existing ML FCM is the only time the client
// will need to make an asynchronous call to the server, but create/delete/update also
// have to go through the service as it is maintaining local (to the client) state.
// As the server gets built out, the local service will determine when to hit the server 
// and when to serve from local cache
export enum AspectActionTypes {
    LoadAspects = '[Aspect] Load',
    LoadAspectsSuccess = '[Aspect] Load Success',
    LoadAspectsFailure = '[Aspect] Load Failure',
    SetCurrentAspect = '[Aspect] Set Current Aspect',
    CreateAspect = '[Aspect] Create Aspect',
    CreateAspectSuccess = '[Aspect] Create Aspect Success',
    CreateAspectFailure = '[Aspect] Create Aspect Failure',
    DeleteAspect = '[Aspect] Delete Aspect',
    DeleteAspectSuccess = '[Aspect] Delete Aspect Success',
    DeleteAspectFailure = '[Aspect] Delete Aspect Failure',
    UpdateAspect = '[Aspect] Update Aspect',
    UpdateAspectSuccess = '[Aspect] Update Aspect Success',
    UpdateAspectFailure = '[Aspect] Update Aspect Failure'
}

// action class denoting an action only, i.e., no payload
export class LoadAspects implements Action {
    readonly type = AspectActionTypes.LoadAspects;
}

// action class involving a payload
export class LoadAspectsSuccess implements Action {
    readonly type = AspectActionTypes.LoadAspectsSuccess;

    constructor(public payload: Aspect[]) {}
}

export class LoadAspectsFailure implements Action {
    readonly type = AspectActionTypes.LoadAspectsFailure;

    constructor(public payload: string) { }
}

export class SetCurrentAspect implements Action {
    readonly type = AspectActionTypes.SetCurrentAspect;

    constructor(public payload: number) { }
}

export class CreateAspect implements Action {
    readonly type = AspectActionTypes.CreateAspect;

    constructor(public payload: Aspect) { }
}

export class CreateAspectSuccess implements Action {
    readonly type = AspectActionTypes.CreateAspectSuccess;

    constructor(public payload: Aspect) { }
}

export class CreateAspectFailure implements Action {
    readonly type = AspectActionTypes.CreateAspectFailure;

    constructor(public payload: string) { }
}

export class DeleteAspect implements Action {
    readonly type = AspectActionTypes.DeleteAspect;

    constructor(public payload: number) { }
}

export class DeleteAspectSuccess implements Action {
    readonly type = AspectActionTypes.DeleteAspectSuccess;

    constructor(public payload: number) { }
}

export class DeleteAspectFailure implements Action {
    readonly type = AspectActionTypes.DeleteAspectFailure;

    constructor(public payload: string) { }
}

export class UpdateAspect implements Action {
    readonly type = AspectActionTypes.UpdateAspect;

    constructor(public payload: Aspect) { }
}

export class UpdateAspectSuccess implements Action {
    readonly type = AspectActionTypes.UpdateAspectSuccess;

    constructor(public payload: Aspect) { }
}

export class UpdateAspectFailure implements Action {
    readonly type = AspectActionTypes.UpdateAspectFailure;

    constructor(public payload: string) { }
}

export type AspectActions = LoadAspects
    | LoadAspects
    | LoadAspectsSuccess
    | LoadAspectsFailure
    | SetCurrentAspect
    | CreateAspect
    | CreateAspectSuccess
    | CreateAspectFailure
    | DeleteAspect
    | DeleteAspectSuccess
    | DeleteAspectFailure
    | UpdateAspect
    | UpdateAspectSuccess
    | UpdateAspectFailure;

