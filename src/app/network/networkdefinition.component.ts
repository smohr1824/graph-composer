import { Component, OnInit, Input } from '@angular/core';
import * as fromState from './state';
import { MLFCM } from '../shared/mlfcm';
import { takeWhile, take } from 'rxjs/operators';
import { select, Store } from '@ngrx/store';
import * as netactions from './state/network.actions';
import * as aspectActions from '../aspects/state/aspect.actions';
import * as actorActions from '../actors/state/actor.actions';
import * as layerActions from '../layers/state/layer.actions';
import * as localforage from 'localforage';
import { AspectState } from '../aspects/state';
import { ElementaryLayerState } from '../layers/state';
import { ActorState } from '../actors/state';

@Component({
  selector: 'app-networkdefinition',
  templateUrl: './networkdefinition.component.html',
  styleUrls: ['./networkdefinition.component.css']
})
export class NetworkdefinitionComponent implements OnInit {
  private title = 'Top-Level Definition';
  private network: MLFCM = {name:'', threshold: fromState.thresholdType.Bivalent, modifiedKosko: true, aspects: [], actors: [], layers: []};
  private componentActive = false;

  constructor(private store: Store<fromState.NetworkState>,
    private aspectStore: Store<AspectState>,
    private actorStore: Store<ActorState>,
    private layerStore: Store<ElementaryLayerState> ) { }

  ngOnInit() {
    let mlname: string;
    this.store.pipe(select(fromState.getNetworkName), take(1)).subscribe(name => { mlname = name; } );
    if (mlname != null && mlname != '') {
      this.network.name = mlname;

      this.store.pipe(select(fromState.getNetworkThreshold), take(1)).subscribe(thresh => {this.network.threshold = thresh;});
      this.store.pipe(select(fromState.getNetworkModified), take(1)).subscribe(mod => this.network.modifiedKosko = mod);
    }    
  }

  ngOnDestroy() {
    this.componentActive = false;
  }

  SetDefn() {
    this.store.dispatch(new netactions.SetNetworkName(this.network.name));
    this.store.dispatch(new netactions.SetNetworkThreshold(this.network.threshold));
    this.store.dispatch(new netactions.SetNetworkRule(this.network.modifiedKosko));

    let ml:MLFCM;
    console.log('checking for network state, name= ' + this.network.name);
    localforage.getItem(this.network.name, (err, s: MLFCM) => {
      ml = s; if (ml != null) {
        this.updateGlobal(ml);
      }
    });

  }

  updateGlobal(ml: MLFCM) {
    console.log('in updateGlobal');
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

}
