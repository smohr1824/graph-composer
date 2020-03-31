import { Component, OnInit, OnDestroy } from '@angular/core';
import { Aspect } from '../shared/aspect';
import { AspectService } from '../shared/aspect.service';

// NgRx-related state management
import { Store, select } from '@ngrx/store';
import * as fromAspects from './state';
import * as aspectActions from './state/aspect.actions';
import { takeWhile } from 'rxjs/operators';

@Component({
  selector: 'app-aspect-container',
  templateUrl: './aspect-container.component.html',
  styleUrls: ['./aspect-container.component.css']
})
export class AspectContainerComponent implements OnInit, OnDestroy {
  aspects: Aspect[];
  currentAspect: Aspect;
  componentActive: boolean = true;

  constructor( private store: Store<fromAspects.AspectState>) { }

  ngOnInit() {
    this.store.dispatch(new aspectActions.LoadAspects());
    this.store.pipe(select(fromAspects.getCurrentAspect), takeWhile(() => this.componentActive)).subscribe(currentAspect => this.currentAspect = currentAspect);
    this.store.pipe(select(fromAspects.getAspects), takeWhile(()=>this.componentActive)).subscribe(aspects => this.aspects = aspects);
  }

  ngOnDestroy() {
    this.componentActive = false;
  }

  selected(aspect: Aspect) {
    this.store.dispatch(new aspectActions.SetCurrentAspect(aspect.id))
  }

  deleteAspect(id: number) {
    // this.aspectService.deleteAspect(id);
    this.store.dispatch(new aspectActions.DeleteAspect(id));
    this.aspects = this.aspects.filter((item, _) => item.id != id);
    this.currentAspect = this.aspects[0];
  }

  

}

