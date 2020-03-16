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
    layerSet: ['flow', 'electrical', 'control']
  },
  {
    name: 'Location',
    layerSet: ['SLTC', 'PHL', 'PHX', 'JC']
  }
]
