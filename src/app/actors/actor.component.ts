import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActorService } from '../shared/actor.service';
import { Actor } from '../shared/actor';

// NgRx-related state management
import { Store, select } from '@ngrx/store';
import * as fromActors from './state';
import * as actorActions from './state/actor.actions';
import { takeWhile } from 'rxjs/operators';

@Component({
  selector: 'app-actor',
  templateUrl: './actor.component.html',
  styleUrls: ['./actor.component.css']
})
export class ActorComponent implements OnInit, OnDestroy {
  title: string = 'Actors';
  actor: Actor;
  actors: Actor[];
  private componentActive = true;

  constructor( private store: Store<fromActors.ActorState>) {

   }

  ngOnInit() {
    this.store.dispatch(new actorActions.LoadActors());
    this.store.pipe(select(fromActors.getActors), takeWhile(()=>this.componentActive)).subscribe(actors => this.actors = actors);
    if (this.actors.length > 0) {
      this.actor = this.actors[0];
    }
  }

  ngOnDestroy() {
    this.componentActive = false;
  }

  selectActor(actor: Actor) {
    this.actor = actor;
  }

  deleteActor(id: number) {
    this.store.dispatch(new actorActions.DeleteActor(id));
  }

}
