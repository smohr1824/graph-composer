import { NetworkActionTypes, NetworkActions } from './network.actions';
import { thresholdType, NetworkState } from '.';
import { ɵangular_packages_platform_browser_dynamic_platform_browser_dynamic_a } from '@angular/platform-browser-dynamic';


const initialState: NetworkState = {
    name: '',
    threshold: thresholdType.Bivalent,
    modifiedKosko: true
}

export function reducer(state = initialState, action: NetworkActions): NetworkState {
  switch(action.type) {
      case NetworkActionTypes.SetNetworkName:
        return {
          ...state,
          name: action.payload,
        };

      case NetworkActionTypes.SetNetworkRule:
        return {
          ...state,
          modifiedKosko: action.payload

        }

      case NetworkActionTypes.SetNetworkThreshold:
        return { 
          ...state, 
          threshold: action.payload
        };

      default:
        return state;
    }
}