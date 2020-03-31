import { createFeatureSelector, createSelector } from '@ngrx/store';
import { Actor } from '../../shared/actor';

export interface ActorState {
    actors: Actor[];
    error: string;

}

// Selector functions
const getActorFeatureState = createFeatureSelector<ActorState>('actors');

export const getActor = createSelector(
  getActorFeatureState,
  (state, props) => 
  {return state.actors.find(p => p.id === props.tid)}
)

export const getActors = createSelector(
  getActorFeatureState,
  state => state.actors
)