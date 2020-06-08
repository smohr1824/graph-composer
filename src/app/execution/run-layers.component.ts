import { Component, OnInit, Input } from '@angular/core';
import { MultilayerCognitiveConceptState } from '../shared/cognitivestate';

@Component({
  selector: 'app-concepts-details',
  templateUrl: './run-layers.component.html',
  styleUrls: ['./run-layers.component.css']
})
export class RunLayersComponent implements OnInit {
  @Input() conceptState: MultilayerCognitiveConceptState;
  title: string = 'Concept Layer Levels';

  constructor() { }

  ngOnInit() {
    
  }

}
