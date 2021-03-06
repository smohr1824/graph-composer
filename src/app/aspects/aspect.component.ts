import { Component, OnInit, OnDestroy } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AspectService } from '../shared/aspect.service';
import { Aspect } from '../shared/aspect';
import { Store, select } from '@ngrx/store';
import * as fromAspects from './state';
import { takeWhile } from 'rxjs/operators';

@Component({
  selector: 'app-aspect',
  templateUrl: './aspect.component.html',
  styleUrls: ['./aspect.component.css']
})
export class AspectComponent implements OnInit {
  title: String = 'Aspects';
  aspects: Aspect[];
  errorMessage: string;
  private componentActive: boolean = true;

  constructor(private store: Store<fromAspects.AspectState>) { }

  ngOnInit() {
    this.store.pipe(select(fromAspects.getAspects), takeWhile(()=>this.componentActive)).subscribe(aspects => this.aspects = aspects);
  }

  ngOnDestroy() {
    this.componentActive = false;
  }

}
