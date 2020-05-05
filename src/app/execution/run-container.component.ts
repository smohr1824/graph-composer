import { Component, OnInit, OnDestroy } from '@angular/core';
import { MultilayerCognitiveConceptState } from '../shared/cognitivestate';
import { HttpClient } from '@angular/common/http';
import { Store, select } from '@ngrx/store';
import { MLFCM } from '../shared/mlfcm';
import * as fromNetwork from '../network/state';
import * as fromActors from '../actors/state';
import * as fromAspects from '../aspects/state';
import * as fromLayers from '../layers/state';
import * as fromExecution from './state';
import { take, takeWhile } from 'rxjs/operators';
import { FcmService } from '../shared/fcm.service';
import * as executionActions from './state/execution.actions';
import { ElementaryLayer } from '../shared/elementary-layer';
import { Aspect } from '../shared/aspect';
import { Actor } from '../shared/actor';

@Component({
  selector: 'app-run-container',
  templateUrl: './run-container.component.html',
  styleUrls: ['./run-container.component.css']
})
export class RunContainerComponent implements OnInit, OnDestroy {
  private network: MLFCM = {name:'', threshold: fromNetwork.thresholdType.Bivalent, modifiedKosko: true, aspects: [], actors: [], layers: []};
  private states: MultilayerCognitiveConceptState[];
  private currentState: MultilayerCognitiveConceptState;
  private loaded: boolean;
  private netName: string;
  private componentActive: boolean = true;
  private genCt: number = 1;
  private errorMsg: string = '';

  constructor(private netStore: Store<fromNetwork.NetworkState>, 
    private aspectStore: Store<fromAspects.AspectState>,
    private actorStore: Store<fromActors.ActorState>,
    private layerStore: Store<fromLayers.ElementaryLayerState>,
    private exStore: Store<fromExecution.ExecutionState>, private fcmSvc: FcmService, private http: HttpClient) { }

  ngOnInit() {
    this.netStore.pipe(select(fromNetwork.getNetworkName), take(1)).subscribe(name => { 
      this.netName = name;
    });
    this.netStore.pipe(select(fromNetwork.getNetworkName), takeWhile(() => this.componentActive)).subscribe(name => this.netName = name);

    this.exStore.pipe(select(fromExecution.getStates), takeWhile(
      () => this.componentActive)).subscribe(concepts => this.states = concepts);

    this.exStore.pipe(select(fromExecution.getCurrentState), takeWhile(
      () => this.componentActive)).subscribe(concept => this.currentState = concept);

    this.exStore.pipe(select(fromExecution.getMapLoaded), takeWhile(
      () => this.componentActive)).subscribe(loaded => this.loaded = loaded);

    this.exStore.pipe(select(fromExecution.getError), takeWhile(
      () => this.componentActive)).subscribe(err => this.errorMsg = err);
  } 

  ngOnDestroy() {
    this.componentActive = false;
  }

  runNetwork() { 
    let params: executionActions.ExecuteMapParams = new executionActions.ExecuteMapParams(this.netName, this.genCt);
    this.exStore.dispatch(new executionActions.ExecuteMap(params));
  }

  getGlobalState(): MLFCM {
    let ml = new MLFCM();
    this.netStore.pipe(select(fromNetwork.getNetworkName), take(1)).subscribe(
      s => { ml.name = s;  }
    );
    this.netStore.pipe(select(fromNetwork.getNetworkThreshold), take(1)).subscribe(
      s => { ml.threshold = s; }
    );
    this.netStore.pipe(select(fromNetwork.getNetworkModified), take(1)).subscribe(
      s => { ml.modifiedKosko = s; }
    );

    this.aspectStore.pipe(select(fromAspects.getAspects), take(1)).subscribe(
      s => { ml.aspects = s ;}
    );

    this.actorStore.pipe(select(fromActors.getActors), take(1)).subscribe(
      s => { ml.actors = s; }
    );

    this.netStore.pipe(select(fromLayers.getLayers), take(1)).subscribe(
      s => {ml.layers = s; }
    );

    return ml;
  }

  select(state: MultilayerCognitiveConceptState) {
    this.exStore.dispatch(new executionActions.SetCurrentConcept(state));
  }

  upload() {
    let ml = this.getGlobalState();
    let gml = this.writeNetworkGML(ml);
    let paramsY: executionActions.ExecuteMapParams = new executionActions.ExecuteMapParams(this.netName, this.genCt);
    let params: executionActions.LoadMapParams = new executionActions.LoadMapParams(ml.name, gml);
    this.exStore.dispatch(new executionActions.LoadMap(params));

  }
  writeNetworkGML(ml: MLFCM): string {

    // build a concordance of nodes and the layers in which they appear
    let nodeLayers = this.makeConcordance(ml);

    let GML: string = "multilayer_network [\r\n";
    GML += "\tdirected\t1\r\n";
    GML += '\tthreshold\t';
    switch (ml.threshold) {
      case fromNetwork.thresholdType.Bivalent:
        GML += '"bivalent"\r\n';
        break;

      case fromNetwork.thresholdType.Trivalent:
        GML += '"trivalent"\r\n';
        break;

      case fromNetwork.thresholdType.Logistic:
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
