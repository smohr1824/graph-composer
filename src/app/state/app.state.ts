import { AspectState } from '../aspects/state';
import { ActorState } from '../actors/state';

export interface State {
    aspect: AspectState;
    actor: ActorState;
}