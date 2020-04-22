import { thresholdType } from '../network/state';
import { Aspect } from './aspect';
import { Actor } from './actor';
import { ElementaryLayer } from './elementary-layer';

export class MLFCM {
    name: string;
    threshold: thresholdType;
    modifiedKosko: boolean;
    aspects: Aspect[];
    actors: Actor[];
    layers: ElementaryLayer[];
}