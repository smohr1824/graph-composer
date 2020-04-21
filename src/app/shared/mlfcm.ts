import { thresholdType } from '../network/state';
import { Aspect } from './aspect';

export class MLFCM {
    name: string;
    threshold: thresholdType;
    modifiedKosko: boolean;
    aspects: Aspect[];
}