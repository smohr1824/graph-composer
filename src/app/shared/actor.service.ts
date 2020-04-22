import { Injectable, OnInit } from '@angular/core';
import { Observable, of, from } from 'rxjs';
import { Actor } from './actor';
import { mergeMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ActorService {
  constructor() { }

  getActors(): Observable<Actor[]> {
      return of(ACTORS);
  }
  getActor(id: number): Observable<Actor> {
    return of(ACTORS.find((actor) => actor.id === id));
  }

  saveActor(actor: Actor): Observable<Actor>{
    const index = ACTORS.findIndex((act:Actor) => act.id === actor.id);
    if (index === -1) {
      ACTORS = [...ACTORS, actor];   
    } else {
      ACTORS = [...ACTORS.slice(0, index), actor, ...ACTORS.slice(index + 1)];
    }
    return of(actor);
  }

  saveActors(actors: Actor[]): Observable<Actor[]> {
    ACTORS = actors;
    return of(actors);
  }

  deleteActor(id: number): Observable<number> {
    const index = ACTORS.findIndex((act:Actor) => act.id === id);
    if (index != -1) {
      ACTORS = ACTORS.filter((item, _) => item.id != id);
      return of(id);
    }
  }

}

let ACTORS: Actor[] = [ ];
