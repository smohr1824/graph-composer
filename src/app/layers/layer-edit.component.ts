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
      initialLevel: [0, [Validators.required, Validators.min(0), Validators.max(1)]],
        activationLevel: [0, [Validators.required, Validators.min(0), Validators.max(1)]]
    })

    this.targetForm = this.fb.group({
      targets: new FormControl((this.actors && this.actors.length > 0)?this.actors[0].name : ''),
      weight: [0, [Validators.required, Validators.min(-1), Validators.max(1)]]
    })
  }

  ngOnDestroy() {
    this.componentActive = false;
  }

  writeVector() {
    console.log(this.vectorForm.value);
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
        this.drawNode(this, x, y, selectedActor);
        this.addNode(selectedActor, x, y);
        break;

      case 'influence':
        this.drawEdge(this, selectedActor, selectedTarget);
        this.addEdge(this, selectedActor, selectedTarget);
    }
         
  }

  drawNode(comp: LayerEditComponent, x: number, y: number, label: string) {
    comp.cx.beginPath();
    comp.cx.arc(x, y, RADIUS, 0, 2*Math.PI, false);
    comp.cx.stroke();
    comp.cx.font = '12px Arial';
    comp.cx.textAlign = 'center';
    comp.cx.textBaseline = 'middle';
    comp.cx.fillText(label, x, y + 24);
  }

  addNode(name: string, x: number, y: number) {
    let node = new data.Node();
    node.concept = new Concept();
    let actorMatch = this.actors.filter(item => item.name === name);
    if (actorMatch.length > 0) {
      let actor = actorMatch[0];
      node.concept.name = actor.name;
      node.concept.id = actor.id;
      node.id = actor.id;
    } else {
      node.id = this.idSvc.nextActorId();
    }
    node.x = x;
    node.y = y;
    this.nodes.push(node);
  }

  drawEdge(comp: LayerEditComponent, src: string, tgt: string) {

    // TODO: offset when a reciprocal edge exists
    let reciprocalEdge = this.edges.find(edge => edge.source === tgt && edge.target === src);

    let srcActors = this.nodes.filter(actor => actor.concept.name === src);
    let tgtActors = this.nodes.filter(actor => actor.concept.name === tgt);
    if (srcActors.length > 0 && tgtActors.length > 0) {
      let srcActor = srcActors[0];
      let tgtActor = tgtActors[0];
      let theta = Math.atan2(tgtActor.y - srcActor.y, tgtActor.x - srcActor.x);

      let startX:number;
      let startY: number;
      let endX: number;
      let endY: number;
      if (reciprocalEdge == null) {
        startX = srcActor.x + RADIUS * Math.cos(theta);
        startY = srcActor.y + RADIUS * Math.sin(theta);
        endX = tgtActor.x - RADIUS * Math.cos(theta);
        endY = tgtActor.y - RADIUS * Math.sin(theta);
      } else {
        // there is an existing reciprocal edge, so offset the new one
        // TODO: if we end up doing a mass redraw, offset both
        let thetaPrimeSrc = theta + 25 * Math.PI/180;
        let thetaPrimeTgt = theta - 25 * Math.PI/180;

        startX = srcActor.x + RADIUS * Math.cos(thetaPrimeSrc);
        startY = srcActor.y + RADIUS * Math.sin(thetaPrimeSrc);
        endX = tgtActor.x - RADIUS * Math.cos(thetaPrimeTgt);
        endY = tgtActor.y - RADIUS * Math.sin(thetaPrimeTgt);
      }
      let wt:number = +comp.targetForm.value['weight'];
      // negatives weights are in red
      if (wt < 0) {
        comp.cx.strokeStyle = '#8B0000';
        comp.cx.fillStyle = '#8B0000';
      }
      comp.cx.beginPath();
      comp.cx.moveTo(startX, startY);
      comp.cx.lineTo(endX, endY);
      
      let labelX = startX + (endX - startX)/2;
      let labelY = startY + (endY - startY)/2;
      comp.cx.font = '12px Arial';
      comp.cx.textAlign = 'center';
      comp.cx.textBaseline = 'middle';
      comp.cx.fillText(wt.toFixed(2), labelX, labelY);

      comp.cx.stroke();

      // now do the arrow head
      comp.cx.beginPath();
      comp.cx.moveTo(endX, endY);
      comp.cx.lineTo(endX-HEADSIZE*Math.cos(theta-Math.PI/7), endY-HEADSIZE*Math.sin(theta-Math.PI/7));
      console.log(theta);
      // from one side of the head to the other
      comp.cx.lineTo(endX-HEADSIZE*Math.cos(theta+Math.PI/7), endY-HEADSIZE*Math.sin(theta+Math.PI/7));
      console.log(theta)
      // side to tip, then back to the starting side
      comp.cx.lineTo(endX, endY);
      comp.cx.lineTo(endX-HEADSIZE*Math.cos(theta-Math.PI/7), endY-HEADSIZE*Math.sin(theta-Math.PI/7));
      console.log(theta);
      comp.cx.stroke();
      comp.cx.fill();

      comp.cx.strokeStyle = '#000000';
      comp.cx.fillStyle = '#000000';
    }
  }

  addEdge(comp: LayerEditComponent, src: string, tgt: string) {
    let edge = new data.Edge();
    edge.source = src;
    edge.target = tgt;

    let srcActors = this.nodes.filter(actor => actor.concept.name === src);
    let tgtActors = this.nodes.filter(actor => actor.concept.name === tgt);
    if (srcActors.length > 0 && tgtActors.length > 0) {
      let srcActor = srcActors[0];
      let tgtActor = tgtActors[0];

      edge.srcX = srcActor.x;
      edge.srcY = srcActor.y;
      edge.tgtX = tgtActor.x;
      edge.tgtY = tgtActor.y;
      edge.weight = +comp.targetForm.value['weight'];
      this.edges.push(edge);
    }
  }

  mouseToRelativeX(comp: LayerEditComponent, mouseX: number): number {
    return mouseX - comp.canvasRect.left;
  }

  mouseToRelativeY(comp: LayerEditComponent, mouseY: number): number {
    return mouseY - comp.canvasRect.top;
  }

}
