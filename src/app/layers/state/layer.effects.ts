import { Observable, of } from 'rxjs';
import { mergeMap, map, catchError } from 'rxjs/operators';
import { Injectable } from '@angular/core';

import { Action } from '@ngrx/store';
import { Actions, Effect, ofType, createEffect } from '@ngrx/effects';
import { LayerService } from 'src/app/shared/layer.service';

import * as ElementaryLayerActions from './layer.actions';
import { ElementaryLayer } from '../../shared/elementary-layer';


@Injectable()
export class LayerEffects {
    constructor(private actions$: Actions, private layerService: LayerService) {

    }

    @Effect()
    loadActors$ = this.actions$.pipe(
        ofType(ElementaryLayerActions.LayerActionTypes.LoadLayers),
        mergeMap((action: ElementaryLayerActions.LoadLayers) => this.layerService.getLayers(action.payload).pipe(
            map((Actors: ElementaryLayer[]) => (new ElementaryLayerActions.LoadLayersSuccess(Actors)))
        ))
    );

   @Effect()
   deleteActor$ = this.actions$.pipe(ofType(ElementaryLayerActions.LayerActionTypes.DeleteLayer),
   mergeMap((action: ElementaryLayerActions.DeleteLayer) => 
   this.layerService.deleteLayer(action.payload).pipe(map((coord:string) => 
   (new ElementaryLayerActions.DeleteLayerSuccess(coord))))));

   @Effect()
   updateActor$ = this.actions$.pipe(ofType(ElementaryLayerActions.LayerActionTypes.UpdateLayer),
   mergeMap((action: ElementaryLayerActions.UpdateLayer) => 
   this.layerService.updateLayer(action.payload).pipe(map((layer: ElementaryLayer) => 
   (new ElementaryLayerActions.UpdateLayerSuccess(layer)))))
   );
           
   @Effect()
   createActor$ = this.actions$.pipe(ofType(ElementaryLayerActions.LayerActionTypes.CreateLayer),
   mergeMap((action: ElementaryLayerActions.CreateLayer) =>
   this.layerService.createLayer(action.payload).pipe(map((coord: string) =>
   (new ElementaryLayerActions.CreateLayerSuccess(action.payload))))));
}