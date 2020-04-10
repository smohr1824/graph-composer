import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActorService } from '../shared/actor.service';
import { IdService } from '../shared/id.service';
import { Actor } from '../shared/actor';

// NgRx-related state management
import { Store, select } from '@ngrx/store';
import * as fromActors from './state';
import * as actorActions from './state/actor.actions';
import { takeWhile } from 'rxjs/operators';

@Component({
  selector: 'app-actoredit',
  templateUrl: './actoredit.component.html',
  styleUrls: ['./actoredit.component.css']
})
export class ActorEditComponent implements OnInit, OnDestroy {
  private actor: Actor;
  private outActor = new Actor();
  private cardTitle: string;
  actorForm: FormGroup;
  private componentActive = true;
  private create = false;

  constructor(private route: ActivatedRoute, 
    private store: Store<fromActors.ActorState>,
    private idService: IdService,
    private router: Router,
    private fb: FormBuilder) { }

  ngOnInit() {
    const id = +this.route.snapshot.paramMap.get('id');
    this.componentActive = true;

    if (id === -1) {
      this.cardTitle = 'Add New Actor';
      this.actor = new Actor();
      this.actor.name = '';
      this.actor.initialLevel = 0.0;
      this.actor.activationLevel = 0.0;
      this.actor.id = this.idService.nextActorId();
      this.create = true;
    } else {
      this.store.pipe(select(fromActors.getActor, {tid: id}), takeWhile(() => this.componentActive)).subscribe(act => this.actor = act);
      this.cardTitle = 'Edit Actor';
      this.create = false;
    }


    if (id === -1 || this.actor == null) {
      this.actorForm = this.fb.group({
        name: ['', [Validators.required]],
        initialLevel: [0, [Validators.required, Validators.max(1), Validators.min(-1)]]
      });
    } else {
      this.actorForm = this.fb.group({
        name: [this.actor.name, [Validators.required]],
        initialLevel: [this.actor.initialLevel, [Validators.required, Validators.max(1), Validators.min(-1)]]
      })
    }
  }

  ngOnDestroy() {
    this.componentActive = false;
  }

  save() {
    if (this.actorForm.valid){
      this.outActor.id = this.actor.id;
      this.outActor.name = this.actorForm.value['name'];
      this.outActor.initialLevel = +this.actorForm.value['initialLevel'];
      //this.outActor.activationLevel = this.actorForm.value['activationLevel'];

      this.componentActive = false;
      if (this.create) {
        this.store.dispatch(new actorActions.CreateActor(this.outActor));
      } else {
        this.store.dispatch(new actorActions.UpdateActor(this.outActor));
      }

      this.router.navigate(['/actors']);
    } 
  }

  cancel() {
    if (this.actorForm.valid) {
      this.outActor.id = this.actor.id;
      //this.outActor.name = this.actorForm.value['name'];
      //this.outActor.initialLevel = this.actorForm.value['initialLevel'];
      this.outActor.name = this.actor.name;
      this.outActor.initialLevel = this.actor.initialLevel;
      //this.outActor.activationLevel = this.actorForm.value['activationLevel'];
    }
    this.router.navigate(['/actors']);
  }

  checkDirty(): boolean {
    if (this.outActor.name != this.actorForm.value['name']) {
      return true;
    }

    if (this.outActor.initialLevel != +this.actorForm.value['initialLevel']) {
      return true;
    }

    //if (this.outActor.activationLevel != + this.actorForm.value['activationLevel']) {
    //  return true;
    //}
  }

}
