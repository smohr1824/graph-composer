import { Injectable } from '@angular/core';
import { Aspect } from './aspect';


@Injectable({
  providedIn: 'root'
})
export class AspectService {

  constructor() { }

  getAspects(): Aspect[] {
    return ASPECTS;
  }
}

const ASPECTS = [
  {
    id: 1,
    name: 'System',
    layerSet: ['flow', 'electrical', 'control']
  },
  {
    id: 2,
    name: 'Location',
    layerSet: ['SLTC', 'PHL', 'PHX', 'JC']
  }
]
