import { createFeatureSelector, createSelector } from '@ngrx/store';

export interface ExecutionState {
    currentConceptId: number;
    loaded: boolean;
    // concepts: [];
    error: string;
}

const getExecutionFeatureState = createFeatureSelector<ExecutionState>('network');