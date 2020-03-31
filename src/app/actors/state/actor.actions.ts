import { Actor } from '../../shared/actor';
import { Action } from '@ngrx/store';

export enum ActorActionTypes {
    LoadActors = '[Actor] Load',
    LoadActorsSuccess = '[Actor] Load Success',
    LoadActorsFailure = '[Actor] Load Failure',
    CreateActor = '[Actor] Create Actor',
    CreateActorSuccess = '[Actor] Create Actor Success',
    CreateActorFailure = '[Actor] Create Actor Failure',
    DeleteActor = '[Actor] Delete Actor',
    DeleteActorSuccess = '[Actor] Delete Actor Success',
    DeleteActorFailure = '[Actor] Delete Actor Failure',
    UpdateActor = '[Actor] Update Actor',
    UpdateActorSuccess = '[Actor] Update Actor Success',
    UpdateActorFailure = '[Actor] Update Actor Failure'
}

// Actor CRUD operations will always go through the remote service
// Actors are the cognitive concepts in a ML FCM, and the libraries have methods
// for manipulating them at the FCM level
export class LoadActors implements Action {
    readonly type = ActorActionTypes.LoadActors;
}

// action class involving a payload
export class LoadActorsSuccess implements Action {
    readonly type = ActorActionTypes.LoadActorsSuccess;

    constructor(public payload: Actor[]) {}
}

export class LoadActorsFailure implements Action {
    readonly type = ActorActionTypes.LoadActorsFailure;

    constructor(public payload: string) { }
}

export class CreateActor implements Action {
    readonly type = ActorActionTypes.CreateActor;

    constructor(public payload: Actor) { }
}

export class CreateActorSuccess implements Action {
    readonly type = ActorActionTypes.CreateActorSuccess;

    constructor(public payload: Actor) { }
}

export class CreateActorFailure implements Action {
    readonly type = ActorActionTypes.CreateActorFailure;

    constructor(public payload: string) { }
}

export class DeleteActor implements Action {
    readonly type = ActorActionTypes.DeleteActor;

    constructor(public payload: number) { }
}

export class DeleteActorSuccess implements Action {
    readonly type = ActorActionTypes.DeleteActorSuccess;

    constructor(public payload: number) { }
}

export class DeleteActorFailure implements Action {
    readonly type = ActorActionTypes.DeleteActorFailure;

    constructor(public payload: string) { }
}

export class UpdateActor implements Action {
    readonly type = ActorActionTypes.UpdateActor;

    constructor(public payload: Actor) { }
}

export class UpdateActorSuccess implements Action {
    readonly type = ActorActionTypes.UpdateActorSuccess;

    constructor(public payload: Actor) { }
}

export class UpdateActorFailure implements Action {
    readonly type = ActorActionTypes.UpdateActorFailure;

    constructor(public payload: string) { }
}

export type ActorActions = LoadActors
    | LoadActors
    | LoadActorsSuccess
    | LoadActorsFailure
    | CreateActor
    | CreateActorSuccess
    | CreateActorFailure
    | DeleteActor
    | DeleteActorSuccess
    | DeleteActorFailure
    | UpdateActor
    | UpdateActorSuccess
    | UpdateActorFailure;