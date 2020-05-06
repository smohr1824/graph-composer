import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';
import { mergeMap, map, catchError } from 'rxjs/operators';

import { FcmService } from '../../shared/fcm.service';

/* NgRx */
import { Action } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import * as executionActions from './execution.actions';

@Injectable()
export class ExecutionEffects {

  constructor(private fcmService: FcmService,
              private actions$: Actions<executionActions.ExecutionActions>) { }

  @Effect()
  ExecuteMap$: Observable<executionActions.ExecutionActions> = this.actions$.pipe(
    ofType(executionActions.ExecutionActionTypes.ExecuteMap), 
    mergeMap((action: executionActions.ExecuteMap) => 
      this.fcmService.runGenerations(action.payload.NetworkName, action.payload.Generations).pipe(
        map(states => (new executionActions.ExecuteMapSuccess(states))),
        catchError(err => {
          return of(new executionActions.ExecuteMapFailure(err))})
      )
    )
  );

  @Effect()
  LoadMap$: Observable<executionActions.ExecutionActions> = this.actions$.pipe(
    ofType(executionActions.ExecutionActionTypes.LoadMap),
    mergeMap((action: executionActions.LoadMap) => 
      this.fcmService.loadMap(action.payload.NetworkName, action.payload.GML, action.payload.existing).pipe(
        map(loaded => (new executionActions.LoadMapSuccess(action.payload.NetworkName))),
        catchError(err => of(new executionActions.LoadMapFailure(err)))
      )
    )
  );

  @Effect()
  DeleteMap$: Observable<executionActions.ExecutionActions> = this.actions$.pipe(
    ofType(executionActions.ExecutionActionTypes.DeleteMap),
    mergeMap((action) => 
      this.fcmService.deleteMapFromServer(action.payload).pipe(
        map(deleted => (new executionActions.DeleteMapSuccess(true))),
        catchError(err => of(new executionActions.DeleteMapFailure(err)))
      )
    )
  );
}