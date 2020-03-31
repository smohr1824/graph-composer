import { Observable, of } from 'rxjs';
import { mergeMap, map, catchError } from 'rxjs/operators';
import { Injectable } from '@angular/core';

import { Action } from '@ngrx/store';
import { Actions, Effect, ofType, createEffect } from '@ngrx/effects';
import { ActorService } from 'src/app/shared/actor.service';

import * as ActorActions from './actor.actions';
import { Actor } from '../../shared/actor';


@Injectable()
export class ActorEffects {
    constructor(private actions$: Actions, private ActorService: ActorService) {

    }

    @Effect()
    loadActors$ = this.actions$.pipe(
        ofType(ActorActions.ActorActionTypes.LoadActors),
        mergeMap((action: ActorActions.LoadActors) => this.ActorService.getActors().pipe(
            map((Actors: Actor[]) => (new ActorActions.LoadActorsSuccess(Actors)))
        ))
    );

   @Effect()
   deleteActor$ = this.actions$.pipe(ofType(ActorActions.ActorActionTypes.DeleteActor),
   mergeMap((action: ActorActions.DeleteActor) => 
   this.ActorService.deleteActor(action.payload).pipe(map((id:number) => 
   (new ActorActions.DeleteActorSuccess(id))))));

   @Effect()
   updateActor$ = this.actions$.pipe(ofType(ActorActions.ActorActionTypes.UpdateActor),
   mergeMap((action: ActorActions.UpdateActor) => 
   this.ActorService.saveActor(action.payload).pipe(map((asp: Actor) => 
   (new ActorActions.UpdateActorSuccess(asp)))))
   );
           
   @Effect()
   createActor$ = this.actions$.pipe(ofType(ActorActions.ActorActionTypes.CreateActor),
   mergeMap((action: ActorActions.CreateActor) =>
   this.ActorService.saveActor(action.payload).pipe(map((asp: Actor) =>
   (new ActorActions.CreateActorSuccess(action.payload))))));
}