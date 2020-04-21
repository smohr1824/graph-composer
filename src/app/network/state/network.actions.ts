import { MLFCM } from '../../shared/mlfcm';
import { Action } from '@ngrx/store';
import { thresholdType } from '.';

export enum NetworkActionTypes {
    SetNetworkName = '[Network] Set Name',
    SetNetworkThreshold = '[Network] Set Threshold',
    SetNetworkRule = '[Network] Set Rule'
}

// Network-level state is synchronous as it should complete in-memory
export class SetNetworkName implements Action {
    readonly type = NetworkActionTypes.SetNetworkName;

    constructor(public payload: string) { }
}


export class SetNetworkThreshold implements Action {
    readonly type = NetworkActionTypes.SetNetworkThreshold;

    constructor(public payload: thresholdType) {}
}

export class SetNetworkRule implements Action {
    readonly type = NetworkActionTypes.SetNetworkRule;

    constructor(public payload: boolean) { }
}

export type NetworkActions = SetNetworkName 
    | SetNetworkThreshold
    | SetNetworkRule;
