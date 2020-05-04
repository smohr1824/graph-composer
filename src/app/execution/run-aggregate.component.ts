import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MultilayerCognitiveConceptState, ILayerActivationLevel } from './state';

@Component({
  selector: 'app-concepts-aggregate',
  templateUrl: './run-aggregate.component.html',
  styleUrls: ['./run-aggregate.component.css']
})
export class RunAggregateComponent implements OnInit {
  private title: string = 'Concept Aggregate Levels';
  private componentActive: boolean = true;
  @Input() conceptStates: MultilayerCognitiveConceptState[];
  @Output() conceptSelected = new EventEmitter<MultilayerCognitiveConceptState>();
  constructor() { }

  ngOnInit() {
  }

  selectState(state: MultilayerCognitiveConceptState) {
    this.conceptSelected.emit(state);
  }

}
