import { Component, OnInit, Input } from '@angular/core';
import * as fromState from './state';
import { MLFCM } from '../shared/mlfcm';
import { takeWhile, take } from 'rxjs/operators';
import { select, Store } from '@ngrx/store';
import * as netactions from './state/network.actions';
import * as aspectActions from '../aspects/state/aspect.actions';
import * as fromActors from '../actors/state';
import * as fromAspects from '../aspects/state';
import * as fromLayers from '../layers/state';
import * as actorActions from '../actors/state/actor.actions';
import * as layerActions from '../layers/state/layer.actions';
import * as localforage from 'localforage';
import { AspectState } from '../aspects/state';
import { ElementaryLayerState } from '../layers/state';
import { ActorState } from '../actors/state';
import { Actor } from '../shared/actor';
import { Aspect } from '../shared/aspect';
import { ElementaryLayer } from '../shared/elementary-layer';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-networkdefinition',
  templateUrl: './networkdefinition.component.html',
  styleUrls: ['./networkdefinition.component.css']
})
export class NetworkdefinitionComponent implements OnInit {
  title = 'Top-Level Definition';
  network: MLFCM = {name:'', threshold: fromState.thresholdType.Bivalent, modifiedKosko: true, aspects: [], actors: [], layers: []};
  private componentActive = false;
  private preExisting = false;

  constructor(private store: Store<fromState.NetworkState>,
    private aspectStore: Store<AspectState>,
    private actorStore: Store<ActorState>,
    private layerStore: Store<ElementaryLayerState>,
    private http: HttpClient ) { }

  ngOnInit() {
    let mlname: string;
    this.store.pipe(select(fromState.getNetworkName), take(1)).subscribe(name => { 
      mlname = name;     
      if (mlname != null && mlname != '') {
        this.network.name = mlname;
        this.preExisting = true;
        this.store.pipe(select(fromState.getNetworkThreshold), take(1)).subscribe(thresh => {this.network.threshold = thresh;});
        this.store.pipe(select(fromState.getNetworkModified), take(1)).subscribe(mod => this.network.modifiedKosko = mod);
      } 
    });
  }

  ngOnDestroy() {
    this.componentActive = false;
  }

  SetOpen() {
    this.store.dispatch(new netactions.SetNetworkName(this.network.name));
    this.store.dispatch(new netactions.SetNetworkThreshold(this.network.threshold));
    this.store.dispatch(new netactions.SetNetworkRule(this.network.modifiedKosko));

    let ml:MLFCM;

    localforage.getItem(this.network.name, (err, s: MLFCM) => {
      ml = s; if (ml != null) {
          this.updateGlobal(ml);
          this.preExisting = true;
        } else {
          this.preExisting = false;
        }
    });
  }

  SetDefn() {
    this.store.dispatch(new netactions.SetNetworkName(this.network.name));
    this.store.dispatch(new netactions.SetNetworkThreshold(this.network.threshold));
    this.store.dispatch(new netactions.SetNetworkRule(this.network.modifiedKosko));
  }

  updateGlobal(ml: MLFCM) {
    this.aspectStore.dispatch(new aspectActions.SetAspects(ml.aspects));
    this.actorStore.dispatch(new actorActions.SaveActors(ml.actors));
    this.layerStore.dispatch(new layerActions.SetLayers(ml.layers));
    this.store.dispatch(new netactions.SetNetworkName(ml.name));
    this.store.dispatch(new netactions.SetNetworkThreshold(ml.threshold));
    this.store.dispatch(new netactions.SetNetworkRule(ml.modifiedKosko));

    this.network.name = ml.name;
    this.network.threshold = ml.threshold;
    this.network.modifiedKosko = ml.modifiedKosko;
  }

  ClearAll() {
    this.network.name = '';
    this.network.threshold = fromState.thresholdType.Bivalent;
    this.network.modifiedKosko = true;

    // clear other state
    this.layerStore.dispatch(new layerActions.SetLayers([]));
    this.actorStore.dispatch(new actorActions.SaveActors([]));
    this.aspectStore.dispatch(new aspectActions.SetAspects([]));
  }

  getGlobalState(): MLFCM {
    let ml = new MLFCM();
    this.store.pipe(select(fromState.getNetworkName), take(1)).subscribe(
      s => { ml.name = s;  }
    );
    this.store.pipe(select(fromState.getNetworkThreshold), take(1)).subscribe(
      s => { ml.threshold = s; }
    );
    this.store.pipe(select(fromState.getNetworkModified), take(1)).subscribe(
      s => { ml.modifiedKosko = s; }
    );

    this.aspectStore.pipe(select(fromAspects.getAspects), take(1)).subscribe(
      s => { ml.aspects = s ;}
    );

    this.actorStore.pipe(select(fromActors.getActors), take(1)).subscribe(
      s => { ml.actors = s; }
    );

    this.store.pipe(select(fromLayers.getLayers), take(1)).subscribe(
      s => {ml.layers = s; }
    );

    return ml;
  }
}
