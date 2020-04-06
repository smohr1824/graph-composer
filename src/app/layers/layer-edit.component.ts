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
      targets: new FormControl((this.actors && this.actors.length > 0)?this.actors[0].name : '')
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
    }
         
  }

  drawNode(comp: LayerEditComponent, x: number, y: number, label: string) {
    comp.cx.beginPath();
    comp.cx.arc(x, y, 15, 0, 2*Math.PI, false);
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

  mouseToRelativeX(comp: LayerEditComponent, mouseX: number): number {
    return mouseX - comp.canvasRect.left;
  }

  mouseToRelativeY(comp: LayerEditComponent, mouseY: number): number {
    return mouseY - comp.canvasRect.top;
  }

}
