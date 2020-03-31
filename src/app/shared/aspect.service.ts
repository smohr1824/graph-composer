import { Injectable } from '@angular/core';
import { Aspect } from './aspect';
import { Observable, of } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AspectService {

  constructor() { }

  getAspects(): Observable<Aspect[]> {
    return of(ASPECTS);
  }

  getAspect(id:number): Aspect {
    return ASPECTS.find(x => x.id === id);
  }

  saveAspect(aspect: Aspect): Observable<Aspect> {
    const index = ASPECTS.findIndex((asp:Aspect) => asp.id === aspect.id);
    if (index === -1) {
      ASPECTS = [...ASPECTS, aspect];      
    } else {
      ASPECTS = [...ASPECTS.slice(0, index), aspect, ...ASPECTS.slice(index + 1)];
    }
    return of(aspect);
  }

  deleteAspect(id: number): Observable<number> {
    const index = ASPECTS.findIndex((asp:Aspect) => asp.id === id);
    if (index != -1) {
      ASPECTS = ASPECTS.filter((item, _) => item.id != id);
      return of(id);
    } 
  }

  updateAspect(aspect: Aspect): Observable<Aspect> {
    const index = ASPECTS.findIndex((asp: Aspect) => asp.id === aspect.id);
    if (index != -1) {
        ASPECTS = ASPECTS.map(item => aspect.id === item.id ? aspect : item);
        return of(aspect);
      } 
  }

  aspectsAvailable() {
    if (ASPECTS.length > 0) {
      return true;
    }
    return false;
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
