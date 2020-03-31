import { Observable, of } from 'rxjs';
import { mergeMap, map, catchError } from 'rxjs/operators';
import { Injectable } from '@angular/core';

import { Action } from '@ngrx/store';
import { Actions, Effect, ofType, createEffect } from '@ngrx/effects';
import { AspectService } from 'src/app/shared/aspect.service';

import * as aspectActions from './aspect.actions';
import { Aspect } from '../../shared/aspect';


// TODO: We are maintaining state in two places because we have no backing service.
// TODO: Replace ASPECTS with calls to a backing service. Aspect creation/deletion will be local only
// (no call to serve, no Effect). Only an initial call to load a ML FCM or save a locally
// created on will involve a call to the service.
@Injectable()
export class AspectEffects {
    constructor(private actions$: Actions, private aspectService: AspectService) {

    }

    @Effect()
    loadAspects$ = this.actions$.pipe(
        ofType(aspectActions.AspectActionTypes.LoadAspects),
        mergeMap((action: aspectActions.LoadAspects) => this.aspectService.getAspects().pipe(
            map((aspects: Aspect[]) => (new aspectActions.LoadAspectsSuccess(aspects)))
        ))
    );

   @Effect()
   deleteAspect$ = this.actions$.pipe(ofType(aspectActions.AspectActionTypes.DeleteAspect),
   mergeMap((action: aspectActions.DeleteAspect) => 
   this.aspectService.deleteAspect(action.payload).pipe(map((id:number) => 
   (new aspectActions.DeleteAspectSuccess(id))))));

   @Effect()
   updateAspect$ = this.actions$.pipe(ofType(aspectActions.AspectActionTypes.UpdateAspect),
   mergeMap((action: aspectActions.UpdateAspect) => 
   this.aspectService.updateAspect(action.payload).pipe(map((asp: Aspect) => 
   (new aspectActions.UpdateAspectSuccess(asp)))))
   );
           
   @Effect()
   createAspect$ = this.actions$.pipe(ofType(aspectActions.AspectActionTypes.CreateAspect),
   mergeMap((action: aspectActions.CreateAspect) =>
   this.aspectService.saveAspect(action.payload).pipe(map((asp: Aspect) =>
   (new aspectActions.CreateAspectSuccess(action.payload))))));
}
