import { Component, OnInit, Input } from '@angular/core';
import * as fromState from './state';
import { MLFCM } from '../shared/mlfcm';
import { takeWhile } from 'rxjs/operators';
import { select, Store } from '@ngrx/store';
import * as netactions from './state/network.actions';

@Component({
  selector: 'app-networkdefinition',
  templateUrl: './networkdefinition.component.html',
  styleUrls: ['./networkdefinition.component.css']
})
export class NetworkdefinitionComponent implements OnInit {
  private title = 'Top-Level Definition';
  private network: MLFCM = {name:'', threshold: fromState.thresholdType.Bivalent, modifiedKosko: true, aspects: []};
  private componentActive = false;

  constructor(private store: Store<fromState.NetworkState> ) { }

  ngOnInit() {
    this.store.pipe(select(fromState.getNetworkName), takeWhile(()=>this.componentActive)).subscribe(name => this.network.name = name);
    this.store.pipe(select(fromState.getNetworkThreshold), takeWhile(()=>this.componentActive)).subscribe(thresh => this.network.threshold = thresh);
    this.store.pipe(select(fromState.getNetworkModified), takeWhile(()=>this.componentActive)).subscribe(mod => this.network.modifiedKosko = mod);


  }

  ngOnDestroy() {
    this.componentActive = false;
  }

  SetDefn() {
    this.store.dispatch(new netactions.SetNetworkName(this.network.name));
    this.store.dispatch(new netactions.SetNetworkThreshold(this.network.threshold));
    this.store.dispatch(new netactions.SetNetworkRule(this.network.modifiedKosko));
  }

}
