import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MultilayerCognitiveConceptState } from '../shared/cognitivestate';
import { Store } from '@ngrx/store';
import * as fromExecution from './state';

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
  constructor(private exStore: Store<fromExecution.ExecutionState>) { }

  ngOnInit() {
  }

  selectState(state: MultilayerCognitiveConceptState) {
    this.conceptSelected.emit(state);
    //this.exStore.dispatch(new executionActions.SetCurrentConcept(state));
  }

}
