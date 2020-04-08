import { Component, OnInit, Input, ElementRef, AfterViewInit, ViewChild, OnDestroy } from '@angular/core';
import { CONTEXT_NAME } from '@angular/compiler/src/render3/view/util';
import { fromEvent, Subscription } from 'rxjs';
import { map, takeWhile } from 'rxjs/operators';
import { Aspect } from '../shared/aspect';
import { Actor } from '../shared/actor';
import { IdService } from '../shared/id.service';
import { Store, select } from '@ngrx/store';
import * as fromAspects from '../aspects/state';
import * as fromActors from '../actors/state';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import * as data from './layerElements';
import { Concept } from '../shared/concept';
import { ɵINTERNAL_BROWSER_DYNAMIC_PLATFORM_PROVIDERS } from '@angular/platform-browser-dynamic';
import { reportInvalidActions } from '@ngrx/effects/src/effect_notification';

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
  private aspects: Aspect[];
  private actors: Actor[];
  private nodes: data.Node[];
  private edges: data.Edge[];
  private mode: string = 'concept';
  private canvasRect: ClientRect;

  constructor(private aspectState: Store<fromAspects.AspectState>, 
    private actorState: Store<fromActors.ActorState>, 
    private fb: FormBuilder,
    private idSvc: IdService ) { }

  ngOnInit() {
    this.nodes = [];
    this.edges = [];
    // get the aspects and actors
    this.aspectState.pipe(select(fromAspects.getAspects), takeWhile(()=>this.componentActive)).subscribe(aspects => this.aspects = aspects);
    this.aspectState.pipe(select(fromActors.getActors), takeWhile(()=>this.componentActive)).subscribe(actors => this.actors = actors);
    this.vectorForm = this.fb.group({
      system: new FormControl('flow'),
      location: new FormControl('PHL'),
    });

    this.actorForm = this.fb.group({
      actors: new FormControl((this.actors && this.actors.length > 0)?this.actors[0].name : ''),
      initialLevel: [0, [Validators.required, Validators.min(0), Validators.max(1)]]//,
        //activationLevel: [0, [Validators.required, Validators.min(0), Validators.max(1)]]
    })

    this.targetForm = this.fb.group({
      targets: new FormControl((this.actors && this.actors.length > 0)?this.actors[0].name : ''),
      weight: [0, [Validators.required, Validators.min(-1), Validators.max(1)]]
    })
  }

  ngOnDestroy() {
    this.componentActive = false;
  }

  public ngAfterViewInit() {
      // get the target card
      this.targetEl = document.querySelector('#targetcard');  
    
      // get the context
        this.canvasEl = document.querySelector('canvas');
        //this.vectorForm = document.querySelector('form');
        this.cx = this.canvasEl.getContext('2d');
    
        // set the width and height
        //this.canvasEl.width = this.width;
        this.canvasEl.width = this.width;
        this.canvasEl.height = this.height;
    
        // set some default properties about the line
        this.cx.lineWidth = 1;
        this.cx.lineCap = 'round';
        this.cx.strokeStyle = '#000000';
        this.cx.fillStyle = '#000000';

        fromEvent(this.canvasEl, 'click').subscribe((evt:MouseEvent)=>this.clickCanvas(this,evt), takeWhile(_=>this.componentActive));
        this.canvasRect = this.canvasEl.getBoundingClientRect();
  }


  setMode(mode:string) {
    this.mode = mode;
  }

  clickCanvas(comp: LayerEditComponent, evt: MouseEvent){

    let selectedActor = comp.actorForm.value['actors'];
    let selectedTarget = comp.targetForm.value['targets'];
    
    let rect = comp.canvasEl.getBoundingClientRect();
    let x = evt.clientX - rect.left;
    let y = evt.clientY - rect.top;

    switch (this.mode) {
      case 'concept':
        let initial = +comp.actorForm.value['initialLevel'];
        let nodeId = this.addNode(selectedActor, x, y, initial);
        if (nodeId > -1) {
          this.drawNode(this, x, y, selectedActor, initial);
        }
        break;

      case 'influence':
        let weight = +comp.targetForm.value['weight'];
        let edgeId = this.addEdge(this, selectedActor, selectedTarget, weight);
        if (edgeId > -1) {
          this.drawEdge(this, edgeId, weight);
        }
        break;
      
      case 'delete':
        let id = comp.hitTestNode(x, y);
        if (id != -1) {
          
          // clicked on a node, delete the node -- side effect is to delete all incident edges
          comp.deleteNode(id);
          comp.redraw();
        } else {
          id = comp.hitTestEdge(x, y);
          if (id != -1) {
            comp.deleteEdge(id);
            comp.redraw();
          }
        }
        break; 
    }
  }

  drawNode(comp: LayerEditComponent, x: number, y: number, label: string, level: number) {
    comp.cx.beginPath();
    comp.cx.arc(x, y, RADIUS, 0, 2*Math.PI, false);
    comp.cx.stroke();
    comp.cx.font = '12px Arial';
    comp.cx.textAlign = 'center';
    comp.cx.textBaseline = 'middle';
    comp.cx.fillText(label, x, y + 24);
    if (level <= 0){
      this.setNegative();
      comp.cx.fillText(level.toFixed(1).toString(), x, y);
      this.setPositive();
    } else {
      this.setPositive();
      comp.cx.fillText(level.toFixed(1).toString(), x, y);
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
      this.nodes.push(node);
      return node.id
    }
    return -1;
  }

  deleteNode(id: number) {
    this.nodes = this.nodes.filter(node => node.id != id);

    // delete any edges incident on the deleted node
    this.edges = this.edges.filter(edge => (edge.source != id && edge.target != id));
  }

  drawEdge(comp: LayerEditComponent, id: number, wt: number) {
    let edge = this.edges.find(edge => edge.id === id)
    if (edge != null) {
      if (wt <= 0) {
        comp.setNegative();
      }
      comp.cx.beginPath();
      comp.cx.moveTo(edge.startX, edge.startY);
      comp.cx.lineTo(edge.endX, edge.endY);
        
      
      comp.cx.font = '12px Arial';
      comp.cx.textAlign = 'center';
      comp.cx.textBaseline = 'middle';
      comp.cx.fillText(wt.toFixed(2).toString(), edge.labelX, edge.labelY);

      comp.cx.stroke();

      // now do the arrow head
      comp.cx.beginPath();
      comp.cx.moveTo(edge.endX, edge.endY);
      comp.cx.lineTo(edge.endX-HEADSIZE*Math.cos(edge.theta-Math.PI/7), edge.endY-HEADSIZE*Math.sin(edge.theta-Math.PI/7));
      // from one side of the head to the other
      comp.cx.lineTo(edge.endX-HEADSIZE*Math.cos(edge.theta+Math.PI/7), edge.endY-HEADSIZE*Math.sin(edge.theta+Math.PI/7));

      // side to tip
      comp.cx.lineTo(edge.endX, edge.endY);
      //comp.cx.lineTo(edge.endX-HEADSIZE*Math.cos(edge.theta-Math.PI/7), edge.endY-HEADSIZE*Math.sin(edge.theta-Math.PI/7));
      comp.cx.stroke();
      comp.cx.fill();

      this.setPositive();
    }
  }

  addEdge(comp: LayerEditComponent, src: string, tgt: string, wt: number): number {
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
      edge.weight = wt;//+comp.targetForm.value['weight'];
      this.edges.push(edge);
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
      this.drawNode(this, node.x, node.y, node.concept.name, node.concept.initial);
    });

    this.edges.forEach(edge => {
      this.drawEdge(this, edge.id, edge.weight);
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

  mouseToRelativeX(comp: LayerEditComponent, mouseX: number): number {
    return mouseX - comp.canvasRect.left;
  }

  mouseToRelativeY(comp: LayerEditComponent, mouseY: number): number {
    return mouseY - comp.canvasRect.top;
  }

  setPositive() {
    this.cx.fillStyle = '#000000';
    this.cx.strokeStyle = '#000000';
  }

  setNegative() {
    this.cx.fillStyle = '#8B0000';
    this.cx.strokeStyle = '#8B0000';
  }

}
