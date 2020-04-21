import { createFeatureSelector, createSelector } from '@ngrx/store';

export enum thresholdType {
    Bivalent = '1',
    Trivalent = '2',
    Logistic = '3'
}

export interface NetworkState {
    name: string;
    threshold: thresholdType;
    modifiedKosko: boolean;
}

// Selector functions
const getNetworkFeatureState = createFeatureSelector<NetworkState>('network');

export const getNetworkName = createSelector(
  getNetworkFeatureState,
  state => state.name
);

export const getNetworkThreshold = createSelector(
    getNetworkFeatureState,
    state => state.threshold
);

export const getNetworkModified = createSelector(
    getNetworkFeatureState,
    state => state.modifiedKosko
);
