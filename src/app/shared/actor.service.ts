import { Injectable } from '@angular/core';
import { Actor } from './actor';

@Injectable({
  providedIn: 'root'
})
export class ActorService {

  constructor() { }

  getActors(): Actor[] {
    return ACTORS;
  }
  getActor(id: number): Actor {
    return ACTORS.find((actor) => actor.id === id);
  }

  saveActor(actor: Actor){
    const index = ACTORS.findIndex((act:Actor) => act.id === actor.id);
    if (index === -1) {
      ACTORS = [...ACTORS, actor];   
    } else {
      ACTORS = [...ACTORS.slice(0, index), actor, ...ACTORS.slice(index + 1)];
    }
  }

  deleteActor(id: number) {
    const index = ACTORS.findIndex((act:Actor) => act.id === id);
    if (index != -1) {
      ACTORS = ACTORS.filter((item, _) => item.id != id);
    }
  }
}

let ACTORS: Actor[] = [ ];
