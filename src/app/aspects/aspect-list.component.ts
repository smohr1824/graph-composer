import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { Aspect } from '../shared/aspect';

@Component({
  selector: 'app-aspects-list',
  templateUrl: './aspect-list.component.html',
  styleUrls: ['./aspect-list.component.css']
})
export class AspectListComponent implements OnInit {
  private title: string = "Aspects";
  @Input() aspects: Aspect[];
  @Output() aspectSelected = new EventEmitter<Aspect>();
  @Output() aspectDelete = new EventEmitter<number>();

  constructor() { }

  ngOnInit() {
  }

  selectAspect(aspect: Aspect) {
    this.aspectSelected.emit(aspect);
  }

  deleteAspect(id: number) {
    this.aspectDelete.emit(id);
  }
}
