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
    name: 'System',
    id: 0,
    layerSet: ['flow', 'electrical', 'control']
  },
  {
    name: 'Location',
    id: 1,
    layerSet: ['SLTC', 'PHL', 'PHX', 'JC']
  }
]
