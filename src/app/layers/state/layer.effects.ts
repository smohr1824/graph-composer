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
    getLayer$ = this.actions$.pipe(
        ofType(ElementaryLayerActions.LayerActionTypes.GetLayer),
        mergeMap((action: ElementaryLayerActions.GetLayer) => this.layerService.getLayer(action.payload).pipe(
            map((Layer: ElementaryLayer) =>(new ElementaryLayerActions.GetLayerSuccess(Layer)))
        ))
    );

    @Effect()
    loadLayers$ = this.actions$.pipe(
        ofType(ElementaryLayerActions.LayerActionTypes.LoadLayers),
        mergeMap((action: ElementaryLayerActions.LoadLayers) => this.layerService.getLayers().pipe(
            map((Layers: ElementaryLayer[]) => (new ElementaryLayerActions.LoadLayersSuccess(Layers)))
        ))
    );


    @Effect()
    deleteLayer$ = this.actions$.pipe(ofType(ElementaryLayerActions.LayerActionTypes.DeleteLayer),
    mergeMap((action: ElementaryLayerActions.DeleteLayer) => 
    this.layerService.deleteLayer(action.payload).pipe(map((coord:string) => 
    (new ElementaryLayerActions.DeleteLayerSuccess(coord))))));

   @Effect()
   updateLayer$ = this.actions$.pipe(ofType(ElementaryLayerActions.LayerActionTypes.UpdateLayer),
   mergeMap((action: ElementaryLayerActions.UpdateLayer) => 
   this.layerService.updateLayer(action.payload).pipe(map((layer: ElementaryLayer) => 
   (new ElementaryLayerActions.UpdateLayerSuccess(layer))))));
           
   @Effect()
   createLayer$ = this.actions$.pipe(ofType(ElementaryLayerActions.LayerActionTypes.CreateLayer),
   mergeMap((action: ElementaryLayerActions.CreateLayer) =>
   this.layerService.createLayer(action.payload).pipe(map((lay: ElementaryLayer) =>
   (new ElementaryLayerActions.CreateLayerSuccess(action.payload))))));

   @Effect()
   setLayers$ = this.actions$.pipe(ofType(ElementaryLayerActions.LayerActionTypes.SetLayers),
   mergeMap((action: ElementaryLayerActions.SetLayers) =>
   this.layerService.setLayers(action.payload).pipe(map((lays: ElementaryLayer[]) =>
   (new ElementaryLayerActions.SetLayersSuccess(action.payload))))));
}