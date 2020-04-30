import { Component, OnInit, Input } from '@angular/core';
import * as fromState from './state';
import { MLFCM } from '../shared/mlfcm';
import { takeWhile, take, flatMap } from 'rxjs/operators';
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

@Component({
  selector: 'app-networkdefinition',
  templateUrl: './networkdefinition.component.html',
  styleUrls: ['./networkdefinition.component.css']
})
export class NetworkdefinitionComponent implements OnInit {
  private title = 'Top-Level Definition';
  private network: MLFCM = {name:'', threshold: fromState.thresholdType.Bivalent, modifiedKosko: true, aspects: [], actors: [], layers: []};
  private componentActive = false;
  private preExisting = false;
  private actors: Actor[];
  private aspects: Aspect[];
  private layers: ElementaryLayer[];

  constructor(private store: Store<fromState.NetworkState>,
    private aspectStore: Store<AspectState>,
    private actorStore: Store<ActorState>,
    private layerStore: Store<ElementaryLayerState> ) { }

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

      // set up subscriptions to aspects and layers
      this.actorStore.pipe(select(fromActors.getActors), takeWhile(() => this.componentActive)).subscribe(acts => this.actors = acts);
      this.aspectStore.pipe(select(fromAspects.getAspects), takeWhile(() => this.componentActive)).subscribe(asps => this.aspects = asps);
      this.actorStore.pipe(select(fromLayers.getLayers), takeWhile(() => this.componentActive)).subscribe(lays => this.layers = lays);
    });
  }

  ngOnDestroy() {
    this.componentActive = false;
  }

  SetDefn() {
    this.store.dispatch(new netactions.SetNetworkName(this.network.name));
    this.store.dispatch(new netactions.SetNetworkThreshold(this.network.threshold));
    this.store.dispatch(new netactions.SetNetworkRule(this.network.modifiedKosko));

    let ml:MLFCM;
    if (!this.preExisting) {
      localforage.getItem(this.network.name, (err, s: MLFCM) => {
        ml = s; if (ml != null) {
          this.updateGlobal(ml);
        }
      });
    }
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

  upload() {
    let gml: HTMLTextAreaElement =  document.querySelector("#gml");
    gml.value = this.writeNetworkGML(this.getGlobalState());
  }
  writeNetworkGML(ml: MLFCM): string {

    // build a concordance of nodes and the layers in which they appear
    let nodeLayers = this.makeConcordance(ml);

    let GML: string = "multilayer_network [\r\n";
    GML += "\tdirected\t1\r\n";
    GML += '\tthreshold\t';
    switch (ml.threshold) {
      case fromState.thresholdType.Bivalent:
        GML += '"bivalent"\r\n';
        break;

      case fromState.thresholdType.Trivalent:
        GML += '"trivalent"\r\n';
        break;

      case fromState.thresholdType.Logistic:
        GML += '"logistic"\r\n';
        break;
    }

    GML += "\trule\t";
    if (ml.modifiedKosko) {
      GML += '"modified"';
    } else {
      GML += '"kosko"';
    }

    GML += "\r\n";
    GML += '\taspects\t[\r\n';
    for (let aspect of ml.aspects) {
      GML += this.writeAspect(aspect);
    }

    GML += '\t]\r\n';

    ml.actors.forEach((actor, index) => {
      GML += this.writeConcept(actor, '\t', nodeLayers.get(actor.id));
    });

    ml.layers.forEach((elayer, index) => {
      GML += this.writeLayer(elayer, '\t');
    })
    GML += ']';
    return GML;
  }

  writeAspect(aspect: Aspect): string {
    let retVal = '\t\t' + aspect.name +'\t';
    aspect.layerSet.forEach((ls, index) =>{
      retVal += ls;
      if (index < aspect.layerSet.length - 1) {
        retVal += ',';
      }
    });
    retVal += '\r\n';
    return retVal;
  }

  writeConcept(actor: Actor, indent:string, layers: string[]): string {
    let retVal = indent + 'concept\t[\r\n';
    retVal += indent + '\tid\t' + actor.id.toFixed() + '\r\n';
    retVal += indent + '\tlabel\t' + actor.name + '\r\n';
    retVal += indent + '\tinitial\t' + actor.initialLevel.toFixed(5) + '\r\n';
    retVal += indent + '\taggregate\t' + actor.initialLevel.toFixed(5) + '\r\n';
    // write the layer coordinates followed by the initial level
    retVal += indent + '\tlevels\t[\r\n';

    // iterate through layers and write the initial value as the layer level
    layers.forEach((coords, index) => {
      retVal += indent + '\t\t' + coords + '\t' + actor.initialLevel.toFixed(5) + '\r\n';
    })

    retVal += indent + '\t]\r\n';
    retVal += indent + ']\r\n';
    return retVal;
  }
  
  writeLayer(layer: ElementaryLayer, indent: string) {
    let retVal = indent + 'layer [\r\n';
    retVal += indent + '\tcoordinates\t';
    retVal += layer.coordinates + '\r\n';
    retVal += indent + '\tgraph [\r\n';
    retVal += indent + '\t\tdirected 1\r\n';
    layer.nodes.forEach(node => { 
      retVal += indent + '\t\tnode [\r\n' + indent + '\t\t\tid ' + node.id + '\r\n'
       + indent + '\t\t]\r\n';
      
    });
    layer.edges.forEach(edge => {
      retVal += indent + '\t\tedge [\r\n' + indent + '\t\t\tsource ' + edge.source + '\r\n';
      retVal += indent + '\t\t\ttarget ' + edge.target + '\r\n';
      retVal += indent + '\t\t\tweight ' + edge.weight.toFixed(5).toString() + '\r\n' + 
      indent + '\t\t]\r\n';
    })
    // close graph and layer objects
    retVal += indent + '\t]\r\n' + indent + ']\r\n';
    return retVal;
  }

  makeConcordance(mlfcm: MLFCM): Map<number, string[]> {
    let concordance = new Map<number, string[]>();
    mlfcm.layers.forEach((layer, index) => {
      layer.nodes.forEach((node, idx) => {
        if (concordance.has(node.id)) {
          let currentLayers = concordance.get(node.id);
          concordance.set(node.id, [...currentLayers, layer.coordinates]);
        } else {
          concordance.set(node.id, [layer.coordinates]);
        }
      });
    });
    return concordance;
  }

}
