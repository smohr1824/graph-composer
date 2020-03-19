import { Component, OnInit, Input } from '@angular/core';
import { Aspect } from '../shared/aspect';

@Component({
  selector: 'app-layerset-list',
  templateUrl: './layerset-list.component.html',
  styleUrls: ['./layerset-list.component.css']
})
export class LayersetListComponent implements OnInit {
  @Input() aspect: Aspect;

  constructor() { }

  ngOnInit() {
  }

}
