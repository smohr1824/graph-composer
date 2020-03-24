import { Component, OnInit } from '@angular/core';
import { ActorService } from '../shared/actor.service';
import { Actor } from '../shared/actor';

@Component({
  selector: 'app-actor',
  templateUrl: './actor.component.html',
  styleUrls: ['./actor.component.css']
})
export class ActorComponent implements OnInit {
  title: string = 'Actors';
  actor: Actor;
  actors: Actor[];

  constructor(private actorService: ActorService) {

   }

  ngOnInit() {
    this.actors = this.actorService.getActors();
    if (this.actors.length > 0) {
      this.actor = this.actors[0];
    }
  }

  selectActor(actor: Actor) {
    this.actor = actor;
  }
  deleteActor(id: number) {
    this.actorService.deleteActor(id);
    this.actors = this.actors.filter((item, _) => item.id != id);
    this.actor = this.actors[0];
  }

}
