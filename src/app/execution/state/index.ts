import { createFeatureSelector, createSelector } from '@ngrx/store';
import { MultilayerCognitiveConceptState } from '../../shared/cognitivestate';

export interface ExecutionState {
    currentConcept: MultilayerCognitiveConceptState;
    loaded: boolean;
    conceptStates: MultilayerCognitiveConceptState[];
    error: string;
}

const getExecutionFeatureState = createFeatureSelector<ExecutionState>('execution');

export const getStates = createSelector(
    getExecutionFeatureState,
    state => state.conceptStates
)  

export const getCurrentState = createSelector(
    getExecutionFeatureState,
    state => state.currentConcept
)

export const getMapLoaded = createSelector(
    getExecutionFeatureState,
    state => state.loaded
)

export const getError = createSelector(
    getExecutionFeatureState,
    state => state.error
)