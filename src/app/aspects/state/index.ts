import { createFeatureSelector, createSelector } from '@ngrx/store';
import { Aspect } from '../../shared/aspect';

export interface AspectState {
    currentAspectId: number;
    aspects: Aspect[];
    error: string;

}

// Selector functions
const getAspectFeatureState = createFeatureSelector<AspectState>('aspects');

export const getCurrentAspectId = createSelector(
  getAspectFeatureState,
  state => state.currentAspectId
);

export const getCurrentAspect = createSelector(
    getAspectFeatureState,
    getCurrentAspectId,
    (state, currentAspectId) => {
        return state.aspects.find(p => p.id === currentAspectId);
    }

)

export const getAspect = createSelector(
  getAspectFeatureState,
  (state, props) => 
    {return state.aspects.find(p => p.id === props.tid)}
)

export const getAspects = createSelector(
  getAspectFeatureState,
  state => state.aspects
)