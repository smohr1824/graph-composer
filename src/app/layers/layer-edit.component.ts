import { Component, OnInit, Input, ElementRef, AfterViewInit, ViewChild, OnDestroy } from '@angular/core';
import * as localforage from 'localforage';
import { fromEvent, Subscription } from 'rxjs';
import { map, takeWhile, take } from 'rxjs/operators';
import { Aspect } from '../shared/aspect';
import { Actor } from '../shared/actor';
import { IdService } from '../shared/id.service';
import * as fromNetwork from '../network/state';
import * as fromAspects from '../aspects/state';
import * as fromActors from '../actors/state';
import * as fromLayers from './state';
import * as layerActions from './state/layer.actions';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import * as data from '../shared/layerElements';
import { Concept } from '../shared/concept';

// NgRx-related state management
import { Store, select } from '@ngrx/store';
import { ActivatedRoute } from '@angular/router';
import { ElementaryLayer } from '../shared/elementary-layer';
import { LayerActionTypes } from './state/layer.actions';
import { State } from '../state/app.state';
import { MLFCM } from '../shared/mlfcm';

const RADIUS = 15;
const HEADSIZE = 10;

@Component({
  selector: 'app-layer-edit',
  templateUrl: './layer-edit.component.html',
  styleUrls: ['./layer-edit.component.css']
})
export class LayerEditComponent implements OnInit, AfterViewInit, OnDestroy {
  public width = 800;
  public height = 400;
  private cx: CanvasRenderingContext2D;
  private canvasEl: HTMLCanvasElement
  private targetEl: HTMLHtmlElement;
  private vectorForm: FormGroup;
  private actorForm: FormGroup;
  private targetForm: FormGroup;
  private componentActive = true;
  private netname: string;
  private networkProps: fromNetwork.NetworkState;
  private aspects: Aspect[];
  private actors: Actor[];
  private nodes: data.Node[];
  private edges: data.Edge[];
  private mode: string = 'concept';
  private canvasRect: ClientRect;
  private create: boolean;
  private coords: string[];
  private GML: string;
  layer: ElementaryLayer;

  constructor(private route: ActivatedRoute,
    private appState: Store<State>,
    private networkState: Store<fromNetwork.NetworkState>,
    private aspectState: Store<fromAspects.AspectState>, 
    private actorState: Store<fromActors.ActorState>, 
    private store: Store<fromLayers.ElementaryLayerState>,
    private fb: FormBuilder,
    private idSvc: IdService ) { }

  ngOnInit() {
    this.nodes = [];
    this.edges = [];
    this.coords = [];
    this.layer = new ElementaryLayer();
    const id = this.route.snapshot.paramMap.get('id');
    // get the network name, aspects and actors
    // Get the current value, then subscribe to changes
    this.networkState.pipe(select(fromNetwork.getNetworkName), take(1)).subscribe(
      s => { this.netname = s; console.log('got state: ' + s); }
    );

    this.aspectState.pipe(select(fromNetwork.getNetworkName), takeWhile(()=>this.componentActive)).subscribe(name => this.netname = name);
    this.aspectState.pipe(select(fromAspects.getAspects), takeWhile(()=>this.componentActive)).subscribe(aspects => this.aspects = aspects);
    this.actorState.pipe(select(fromActors.getActors), takeWhile(()=>this.componentActive)).subscribe(actors => this.actors = actors);


    if (id === '-1' ) {
      this.create = true;
    } else {
      let idX = id.replace("[", "");
      idX = idX.replace("]", "");

      this.store.pipe(select(fromLayers.getElementaryLayer, {coords: idX}), 
        takeWhile(() => this.componentActive)).subscribe(lay => {
          this.layer = lay;

          // this.onReceiptOfLayer();
      });

      console.log('layer: ' + this.layer);
      if (this.layer == null) {
        console.log('layer is null, netname is ' + this.netname);
        // is the layer saved to local storage?
        if (this.netname != null && this.netname != '') {
          let key: string = this.netname + ':' + id;
          console.log(key);
          localforage.getItem(key, layer => {
            this.layer = layer;
          });

        }
      }

      this.create = false;
      if (this.layer != null) {
        this.onReceiptOfLayer();
      }
    }

    let controls = {};

    if (this.create) {
      this.aspects.forEach((aspect, index) => { 
          controls[aspect.name]= new FormControl(aspect.layerSet[0]);
      });
    } else {
      this.aspects.forEach((aspect, index) => {
        controls[aspect.name] = new FormControl(this.coords[index]);
      });
    }      
    this.vectorForm = this.fb.group(controls);
    this.vectorForm.updateValueAndValidity({onlySelf: true, emitEvent: true});
     
    this.actorForm = this.fb.group({
      actors: new FormControl((this.actors && this.actors.length > 0)?this.actors[0].name : '')//,
    });

    this.targetForm = this.fb.group({
      targets: new FormControl((this.actors && this.actors.length > 0)?this.actors[0].name : ''),
      weight: [0, [Validators.required, Validators.min(-1), Validators.max(1)]]
    });
  }

  ngOnDestroy() {
    this.componentActive = false;
  }

  public ngAfterViewInit() {
      // get the target card
      this.targetEl = document.querySelector('#targetcard');  
    
      // get the context
        this.canvasEl = document.querySelector('canvas');
        this.cx = this.canvasEl.getContext('2d');
    
        // set the width and height
        this.canvasEl.width = this.width;
        this.canvasEl.height = this.height;
    
        // set some default properties about the line
        this.cx.lineWidth = 1;
        this.cx.lineCap = 'round';
        this.cx.strokeStyle = '#000000';
        this.cx.fillStyle = '#000000';

        fromEvent(this.canvasEl, 'click').subscribe((evt:MouseEvent)=>this.clickCanvas(evt), takeWhile(_=>this.componentActive));
        this.canvasRect = this.canvasEl.getBoundingClientRect();

        if (!this.create) {
          this.redraw();
        }
  }

  onReceiptOfLayer() {
    // set the data
    this.nodes = this.layer.nodes;
    this.edges = this.layer.edges;
    this.coords = this.breakCoordinates(this.layer.coordinates)
  }

  breakCoordinates(coords: string): string[] {
    return coords.split(',');
  }

  setMode(mode:string) {
    this.mode = mode;
  }

  writeLayer() {
    // for now, write out a layer GML fragment. Ultimately, we'll POST it to th backend service
    let elayer: ElementaryLayer = new ElementaryLayer();
    this.GML = 'layer [\r\n';
    this.GML += '\tcoordinates\t';
    let keys = Object.keys(this.vectorForm.controls);
    let coords:string[] = [];
    keys.forEach(key => { 
      coords.push(this.vectorForm.controls[key].value);
    });

    this.GML += coords.join(',') + '\r\n';
    this.GML += '\tgraph [\r\n';
    this.GML += '\t\tdirected 1\r\n';
    this.nodes.forEach(node => { 
      this.GML += '\t\tnode [\r\n\t\t\tid ' + node.id + '\r\n\t\t]\r\n';
      
    });
    this.edges.forEach(edge => {
      this.GML += '\t\tedge [\r\n\t\t\tsource ' + edge.source + '\r\n';
      this.GML += '\t\t\ttarget ' + edge.target + '\r\n';
      this.GML += '\t\t\tweight ' + edge.weight.toFixed(5).toString() + '\r\n\t\t]\r\n';
    })
    this.GML += '\t]\r\n]';

    elayer.coordinates = coords.join(',');
    elayer.edges = this.edges;
    elayer.nodes = this.nodes;

    if (this.create) {
      this.store.dispatch(new layerActions.CreateLayer(elayer));
    } else {
      this.store.dispatch(new layerActions.UpdateLayer(elayer));
    }

    let ml = this.getGlobalState();

    console.log(ml);
    console.log('layers: ' + ml.layers.length);

    if (ml.name != null && ml.name != '') {
      localforage.setItem(ml.name, ml);
    }

  }

  clickCanvas(evt: MouseEvent){
    let selectedActor = this.actorForm.value['actors'];
    let selectedTarget = this.targetForm.value['targets'];
    
    let rect = this.canvasEl.getBoundingClientRect();
    let x = evt.clientX - rect.left;
    let y = evt.clientY - rect.top;

    switch (this.mode) {
      case 'concept':
        let actor = this.actors.find(act => act.name === selectedActor);
        let initial = 0;
        if (actor) {
          initial = actor.initialLevel;
        }

        let nodeId = this.addNode(selectedActor, x, y, initial);
        if (nodeId > -1) {
          this.drawNode(x, y, selectedActor, initial);
        }
        break;

      case 'influence':
        let weight = +this.targetForm.value['weight'];
        let edgeId = this.addEdge(selectedActor, selectedTarget, weight);
        if (edgeId > -1) {
          this.drawEdge(edgeId, weight);
        }
        break;
      
      case 'delete':
        let id = this.hitTestNode(x, y);
        if (id != -1) {
          
          // clicked on a node, delete the node -- side effect is to delete all incident edges
          this.deleteNode(id);
          this.redraw();
        } else {
          id = this.hitTestEdge(x, y);
          if (id != -1) {
            this.deleteEdge(id);
            this.redraw();
          }
        }
        break; 
    }
  }

  drawNode(x: number, y: number, label: string, level: number) {
    this.cx.beginPath();
    this.cx.arc(x, y, RADIUS, 0, 2*Math.PI, false);
    this.cx.stroke();
    this.cx.font = '12px Arial';
    this.cx.textAlign = 'center';
    this.cx.textBaseline = 'middle';
    this.cx.fillText(label, x, y + 24);
    if (level <= 0){
      this.setNegative();
      this.cx.fillText(level.toFixed(1).toString(), x, y);
      this.setPositive();
    } else {
      this.setPositive();
      this.cx.fillText(level.toFixed(1).toString(), x, y);
    }
  }

  addNode(name: string, x: number, y: number, initial: number): number {
    let node = new data.Node();
    node.concept = new Concept();
    let found = this.nodes.find(node => node.concept.name === name);
    let actor = this.actors.find(item => item.name === name);
    if (found == undefined) {

      if (actor != null) {
        node.concept.name = actor.name;
        node.concept.id = actor.id;
        node.id = actor.id;
        node.concept.initial = initial;
        node.concept.level = initial;
      } else {
        node.id = this.idSvc.nextActorId();
      }
      node.x = x;
      node.y = y;
      this.nodes = this.nodes.concat(node);
      return node.id
    }
    return -1;
  }

  deleteNode(id: number) {
    this.nodes = this.nodes.filter(node => node.id != id);

    // delete any edges incident on the deleted node
    this.edges = this.edges.filter(edge => (edge.source != id && edge.target != id));
  }

  drawEdge(id: number, wt: number) {
    let edge = this.edges.find(edge => edge.id === id)
    if (edge != null) {
      if (wt <= 0) {
        this.setNegative();
      }
      this.cx.beginPath();
      this.cx.moveTo(edge.startX, edge.startY);
      this.cx.lineTo(edge.endX, edge.endY);
      this.cx.font = '12px Arial';
      this.cx.textAlign = 'center';
      this.cx.textBaseline = 'middle';
      this.cx.fillText(wt.toFixed(2).toString(), edge.labelX, edge.labelY);
      this.cx.stroke();

      // now do the arrow head
      this.cx.beginPath();
      this.cx.moveTo(edge.endX, edge.endY);
      this.cx.lineTo(edge.endX-HEADSIZE*Math.cos(edge.theta-Math.PI/7), edge.endY-HEADSIZE*Math.sin(edge.theta-Math.PI/7));
      
      // from one side of the head to the other
      this.cx.lineTo(edge.endX-HEADSIZE*Math.cos(edge.theta+Math.PI/7), edge.endY-HEADSIZE*Math.sin(edge.theta+Math.PI/7));

      // side to tip
      this.cx.lineTo(edge.endX, edge.endY);
      this.cx.stroke();
      this.cx.fill();

      this.setPositive();
    }
  }

  addEdge(src: string, tgt: string, wt: number): number {
    let srcActor = this.nodes.find(actor => actor.concept.name === src);
    let tgtActor = this.nodes.find(actor => actor.concept.name === tgt);


    let reciprocalEdge = this.edges.find(edge => edge.source === tgtActor.id && edge.target === srcActor.id);
    if (srcActor != null && tgtActor != null && srcActor.id != tgtActor.id) {
      let edge = new data.Edge();
      let preexisting = this.edges.find(edge => edge.source === srcActor.id && edge.target === tgtActor.id);
      if (preexisting != null) {
        return -1;
      }
      edge.id = this.idSvc.nextEdgeId();
      edge.source = srcActor.id;
      edge.target = tgtActor.id;

      let theta = Math.atan2(tgtActor.y - srcActor.y, tgtActor.x - srcActor.x);
      edge.theta = theta;

      if (reciprocalEdge == null) {
        edge.startX = srcActor.x + RADIUS * Math.cos(theta);
        edge.startY = srcActor.y + RADIUS * Math.sin(theta);
        edge.endX = tgtActor.x - RADIUS * Math.cos(theta);
        edge.endY = tgtActor.y - RADIUS * Math.sin(theta);
      } else {
        // there is an existing reciprocal edge, so offset the new one
        let thetaPrimeSrc = theta + 25 * Math.PI/180;
        let thetaPrimeTgt = theta - 25 * Math.PI/180;

        edge.startX = srcActor.x + RADIUS * Math.cos(thetaPrimeSrc);
        edge.startY = srcActor.y + RADIUS * Math.sin(thetaPrimeSrc);
        edge.endX = tgtActor.x - RADIUS * Math.cos(thetaPrimeTgt);
        edge.endY = tgtActor.y - RADIUS * Math.sin(thetaPrimeTgt);
      }
      edge.labelX = edge.startX + (edge.endX - edge.startX)/2;
      edge.labelY = edge.startY + (edge.endY - edge.startY)/2;
      edge.weight = wt;
      this.edges = this.edges.concat(edge);
      return edge.id;
    }
    return -1;
  }

  deleteEdge(id: number) {
    this.edges = this.edges.filter(edge => edge.id != id);
  }

  redraw() {
    this.cx.clearRect(0, 0, this.canvasEl.width, this.canvasEl.height);
    this.nodes.forEach(node => {
      this.drawNode(node.x, node.y, node.concept.name, node.concept.initial);
    });

    this.edges.forEach(edge => {
      this.drawEdge(edge.id, edge.weight);
    });
  }

  nodeIdfromName(name:string): number {
    let nodeFound = this.nodes.find(node => node.concept.name === name);
    if (nodeFound) {
      return nodeFound.concept.id;
    }
  }

  nodeFromName(name: string): data.Node {
    let nodeFound = this.nodes.find(node => node.concept.name === name);
    return nodeFound;
  }

  hitTestNode(x: number, y: number): number {
    let id = -1;
    this.nodes.forEach(node => {
      let diffX = x - node.x;
      let diffY = y - node.y;
      if ((diffX**2 + diffY**2) < (RADIUS**2)) {
        id = node.id;
      }
    });
    return id;
  }

  // returns edge id if (x,y) is within HEADSIZE of the edge end arrow's tip
  hitTestEdge(x:number, y: number): number {
    let id = -1;
    this.edges.forEach(edge => {
      let diffX = x - edge.endX;
      let diffY = y - edge.endY;

      if ((diffX**2 + diffY**2) <= (HEADSIZE**2)) {
        id = edge.id;
      }
    })
    return id;
  }

  mouseToRelativeX(mouseX: number): number {
    return mouseX - this.canvasRect.left;
  }

  mouseToRelativeY(mouseY: number): number {
    return mouseY - this.canvasRect.top;
  }

  setPositive() {
    this.cx.fillStyle = '#000000';
    this.cx.strokeStyle = '#000000';
  }

  setNegative() {
    this.cx.fillStyle = '#8B0000';
    this.cx.strokeStyle = '#8B0000';
  }

  getGlobalState(): MLFCM {
    let ml = new MLFCM();
    this.networkState.pipe(select(fromNetwork.getNetworkName), take(1)).subscribe(
      s => { ml.name = s;  }
    );
    this.networkState.pipe(select(fromNetwork.getNetworkThreshold), take(1)).subscribe(
      s => { ml.threshold = s; }
    );
    this.networkState.pipe(select(fromNetwork.getNetworkModified), take(1)).subscribe(
      s => { ml.modifiedKosko = s; }
    );

    this.aspectState.pipe(select(fromAspects.getAspects), take(1)).subscribe(
      s => { ml.aspects = s ;}
    );

    this.actorState.pipe(select(fromActors.getActors), take(1)).subscribe(
      s => { ml.actors = s; }
    );

    this.store.pipe(select(fromLayers.getLayers), take(1)).subscribe(
      s => {ml.layers = s; }
    );

    return ml;
  }

}
