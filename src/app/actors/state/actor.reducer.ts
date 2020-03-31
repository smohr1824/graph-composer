import { Actor } from '../../shared/actor';
import { ActorActionTypes, ActorActions } from './actor.actions';
import * as fromActors from '.';

let ACTORS = [];

const initialState = {
    actors: ACTORS,
    error: ''
}

export function reducer(state = initialState, action: ActorActions): fromActors.ActorState {
  switch(action.type) {
      case ActorActionTypes.LoadActorsSuccess:
        return {
          ...state,
          actors: action.payload,
          error: ''
        };

      case ActorActionTypes.LoadActorsFailure:
        return {
          ...state,
          actors: [],
          error: action.payload

        }

      case ActorActionTypes.DeleteActorSuccess:
        return {
          ...state,
          actors: state.actors.filter(actor => actor.id !== action.payload),
          error: ''
        };

      case ActorActionTypes.DeleteActorFailure:
        return {
          ...state,
          error: action.payload
        }

      case ActorActionTypes.UpdateActorSuccess:
        return {
          ...state,
          actors: state.actors.map(
            (item: Actor) => action.payload.id == item.id ? action.payload : item),
          error: ''
        };

      case ActorActionTypes.UpdateActorFailure:
        return {
          ...state,
          error: action.payload
        }

      case ActorActionTypes.CreateActorSuccess:
        let s = state.actors;
        return {
          ...state,
          actors: [...s, action.payload],
          error: ''
        }

      default:
        return state;
    }
}