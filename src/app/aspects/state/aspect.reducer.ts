import { Aspect } from '../../shared/aspect';
import { AspectActionTypes, AspectActions } from './aspect.actions';
import * as fromAspects from '.';


const initialState = {
    currentAspectId: 0,
    aspects: [],
    error: ''
}

export function reducer(state = initialState, action: AspectActions): fromAspects.AspectState {
  switch(action.type) {
      case AspectActionTypes.LoadAspectsSuccess:
        return {
          ...state,
          aspects: action.payload,
          currentAspectId: 0,
          error: ''
        };

      case AspectActionTypes.LoadAspectsFailure:
        return {
          ...state,
          aspects: [],
          error: action.payload

        }

      case AspectActionTypes.SetCurrentAspect:
        return { 
          ...state, 
          currentAspectId: action.payload,
          error: ''
        };

      case AspectActionTypes.DeleteAspectSuccess:
        return {
          ...state,
          aspects: state.aspects.filter(aspect => aspect.id !== action.payload),
          currentAspectId: null,
          error: ''
        };

      case AspectActionTypes.DeleteAspectFailure:
        return {
          ...state,
          error: action.payload
        }

      case AspectActionTypes.UpdateAspectSuccess:
        return {
          ...state,
          aspects: state.aspects.map(
            (item: Aspect) => action.payload.id == item.id ? action.payload : item),
          error: ''
        };

      case AspectActionTypes.UpdateAspectFailure:
        return {
          ...state,
          error: action.payload
        }

      case AspectActionTypes.CreateAspectSuccess:
        let s = state.aspects;
        return {
          ...state,
          aspects: [...s, action.payload],
          error: ''
        }

      case AspectActionTypes.SetAspectsSuccess:
        return {
          ...state,
          aspects: action.payload,
          currentAspectId: action.payload.length > 0? action.payload[0].id : 0,
        }

      case AspectActionTypes.SetAspectsFailure:
        return {
          ...state,
          error: action.payload
        }


      default:
        return state;
    }
}
