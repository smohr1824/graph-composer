import { ExecutionActionTypes, ExecutionActions } from './execution.actions';
import * as fromExecution from '.';

const initialState = {
    currentConcept: null,
    loaded: false,
    conceptStates: [],
    error: ''
}

export function reducer(state = initialState, action: ExecutionActions): fromExecution.ExecutionState {
  switch(action.type) {
      case ExecutionActionTypes.LoadMapSuccess:
        return {
          ...state,
          loaded: action.payload,
          error: ''
        };

      case ExecutionActionTypes.LoadMapFailure:
        return {
          ...state,
          loaded: false,
          error: action.payload

        }

      case ExecutionActionTypes.SetCurrentConceptState:
        return { 
          ...state, 
          currentConcept: action.payload,
          error: ''
        };


      case ExecutionActionTypes.ExecuteMapFailure:
        return {
          ...state,
          error: action.payload,
          conceptStates: []
        }

      case ExecutionActionTypes.ExecuteMapSuccess:
        return {
          ...state,
          conceptStates: action.payload,
          currentConcept: action.payload[0],
          error: ''
        };


      default:
        return state;
    }
}