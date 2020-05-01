import { Action } from '@ngrx/store';

export enum ExecutionActionTypes {
    SetCurrentConceptId = '[Execution] Set Current Concept',
    LoadMap = '[Execution] Load Map',
    LoadMapSuccess = '[Execution] Load Map Success',
    LoadMapFailure = '[Execution] Load Map Failure',
    ExecuteMap = '[Execution] Execute Map',
    ExecuteMapSuccess = '[Execution] Execute Map Success',
    ExecuteMapFailure = '[Execution] Execute Map Failure'
}

export class SetCurrentConceptId implements Action {
    readonly type = ExecutionActionTypes.SetCurrentConceptId;

    constructor(public payload: number) { }
}

export class LoadMap implements Action {
    readonly type = ExecutionActionTypes.LoadMap;

    constructor(public payload: string) { }
}

export class LoadMapSuccess implements Action {
    readonly type = ExecutionActionTypes.LoadMapSuccess;

    constructor(public payload: boolean) { }
}

export class LoadMapFailure implements Action {
    readonly type = ExecutionActionTypes.LoadMapFailure;

    constructor(public payload: string) { }
}

export class ExecuteMap implements Action {
    readonly type = ExecutionActionTypes.ExecuteMap;

    constructor(public payload: number) { }
}

export class ExecuteMapSuccess implements Action {
    readonly type = ExecutionActionTypes.ExecuteMapSuccess;

    constructor(public payload: number[]) { } // TODO: DEFINE TYPE
}

export class ExecuteMapFailure implements Action {
    readonly type = ExecutionActionTypes.ExecuteMapFailure;

    constructor(public payload: string) { }
}

export type ExecutionActions = SetCurrentConceptId 
    | LoadMap
    | LoadMapSuccess
    | LoadMapFailure
    | ExecuteMap
    | ExecuteMapSuccess
    | ExecuteMapFailure;