import { Action } from '@ngrx/store';
import { MultilayerCognitiveConceptState } from '../../shared/cognitivestate';
import { HttpErrorResponse } from '@angular/common/http';

export enum ExecutionActionTypes {
    SetCurrentConceptState = '[Execution] Set Current Concept',
    LoadMap = '[Execution] Load Map',
    LoadMapSuccess = '[Execution] Load Map Success',
    LoadMapFailure = '[Execution] Load Map Failure',
    ExecuteMap = '[Execution] Execute Map',
    ExecuteMapSuccess = '[Execution] Execute Map Success',
    ExecuteMapFailure = '[Execution] Execute Map Failure',
    DeleteMap = '[Execution] Delete Map',
    DeleteMapSuccess = '[Execution] Delete Map Success',
    DeleteMapFailure = '[Execution] Delete Map Failure'
}

export class SetCurrentConcept implements Action {
    readonly type = ExecutionActionTypes.SetCurrentConceptState;

    constructor(public payload: MultilayerCognitiveConceptState) { }
}

export class LoadMap implements Action {
    readonly type = ExecutionActionTypes.LoadMap;

    constructor(public payload: LoadMapParams) { }
}

export class LoadMapSuccess implements Action {
    readonly type = ExecutionActionTypes.LoadMapSuccess;

    constructor(public payload: string) { }
}

export class LoadMapFailure implements Action {
    readonly type = ExecutionActionTypes.LoadMapFailure;

    constructor(public payload: HttpErrorResponse) { }
}

export class ExecuteMap implements Action {
    readonly type = ExecutionActionTypes.ExecuteMap;

    constructor(public payload: ExecuteMapParams) { }
}

export class ExecuteMapSuccess implements Action {
    readonly type = ExecutionActionTypes.ExecuteMapSuccess;

    constructor(public payload: MultilayerCognitiveConceptState[]) { } 
}

export class ExecuteMapFailure implements Action {
    readonly type = ExecutionActionTypes.ExecuteMapFailure;

    constructor(public payload: string) { }
}

export class DeleteMap implements Action {
    readonly type = ExecutionActionTypes.DeleteMap;

    constructor(public payload: string) { }
}

export class DeleteMapSuccess implements Action {
    readonly type = ExecutionActionTypes.DeleteMapSuccess;

    constructor(public payload: boolean) { }
}

export class DeleteMapFailure implements Action {
    readonly type = ExecutionActionTypes.DeleteMapFailure;

    constructor(public payload: HttpErrorResponse) { }
}

export class LoadMapParams {
    NetworkName: string;
    GML: string;
    existing: boolean;

    constructor(name: string, defn: string, existing: boolean) {
        this.NetworkName = name;
        this.GML = defn;
        this.existing = existing;
    }
}

export class ExecuteMapParams {
    NetworkName: string;
    Generations: number;

    constructor(name: string, count: number) {
        this.NetworkName = name;
        this.Generations = count;
    }
}

export type ExecutionActions = SetCurrentConcept 
    | LoadMap
    | LoadMapSuccess
    | LoadMapFailure
    | ExecuteMap
    | ExecuteMapSuccess
    | ExecuteMapFailure
    | DeleteMap
    | DeleteMapSuccess
    | DeleteMapFailure;