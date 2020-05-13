import { mergeMap, map, catchError } from 'rxjs/operators';
import { Injectable } from '@angular/core';

import { Actions, Effect, ofType } from '@ngrx/effects';
import { AspectService } from 'src/app/shared/aspect.service';

import * as aspectActions from './aspect.actions';
import { Aspect } from '../../shared/aspect';

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

   @Effect()
   setAspects$ = this.actions$.pipe(ofType(aspectActions.AspectActionTypes.SetAspects),
   mergeMap((action: aspectActions.SetAspects) => 
   this.aspectService.setAspects(action.payload).pipe(map((asps: Aspect[]) => 
   (new aspectActions.SetAspectsSuccess(action.payload))))));
}
