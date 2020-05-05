import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { Aspect } from '../shared/aspect';
import * as fromAspects from './state';
import * as aspectActions from './state/aspect.actions';
import { Store, select } from '@ngrx/store';
import { takeWhile } from 'rxjs/operators';

@Component({
  selector: 'app-aspects-list',
  templateUrl: './aspect-list.component.html',
  styleUrls: ['./aspect-list.component.css']
})
export class AspectListComponent implements OnInit {
  private title: string = "Aspects";
  private componentActive: boolean = true;
  @Input() aspects: Aspect[];
  @Output() aspectSelected = new EventEmitter<Aspect>();
  @Output() aspectDelete = new EventEmitter<number>();

  constructor(private store: Store<fromAspects.AspectState>) { }

  ngOnInit() {
    this.store.pipe(select(fromAspects.getAspects), takeWhile(()=>this.componentActive)).subscribe((aspects: Aspect[]) => this.aspects = aspects);
  }

  ngOnDestroy() {
    this.componentActive = false;
  }

  selectAspect(aspect: Aspect) {
    this.aspectSelected.emit(aspect);
    //this.store.dispatch(new aspectActions.SetCurrentAspect(aspect.id));
  }

  deleteAspect(id: number) {
    this.aspectDelete.emit(id);
    this.store.dispatch(new aspectActions.DeleteAspect(id));
  }
}
