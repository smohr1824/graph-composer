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

  getAspect(id:number): Aspect {
    return ASPECTS.find(x => x.id === id);
  }

  saveAspect(aspect: Aspect){
    const index = ASPECTS.findIndex((asp:Aspect) => asp.id === aspect.id);
    if (index === -1) {
      ASPECTS = [...ASPECTS, aspect];      
    } else {
      ASPECTS = [...ASPECTS.slice(0, index), aspect, ...ASPECTS.slice(index + 1)];
    }
  }
}

let ASPECTS = [
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
