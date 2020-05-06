import { ExecutionActionTypes, ExecutionActions } from './execution.actions';
import * as fromExecution from '.';
import { HttpErrorResponse } from '@angular/common/http';

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
          loaded: true,
          error: ''
        };

      case ExecutionActionTypes.LoadMapFailure:
        let err: HttpErrorResponse = action.payload;
        if (err.status == 409) {
          return {
            ...state,
            loaded: true,
            error: 'Network exists with that name, resubmit'
          }
        } else {
          return {
            ...state,
            loaded: false,
            error: err.message
          }
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

      case ExecutionActionTypes.DeleteMapSuccess:
        return {
          ...state,
          conceptStates: [],
          currentConcept: null,
          loaded: false,
          error: ''
        }

      case ExecutionActionTypes.DeleteMapFailure:
        let errd: HttpErrorResponse = action.payload;
        if (errd.status == 404) {
          return {
            ...state,
            error: 'Map not found on server'
          }
        } else {
          return {
            ...state,
            error: err.message
          }
        }


      default:
        return state;
    }
}