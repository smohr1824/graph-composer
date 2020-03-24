import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActorService } from '../shared/actor.service';
import { IdService } from '../shared/id.service';
import { Actor } from '../shared/actor';

@Component({
  selector: 'app-actoredit',
  templateUrl: './actoredit.component.html',
  styleUrls: ['./actoredit.component.css']
})
export class ActorEditComponent implements OnInit {
  private actor: Actor;
  private cardTitle: string;
  actorForm: FormGroup;

  constructor(private route: ActivatedRoute, 
    private actorService: ActorService,
    private idService: IdService,
    private router: Router,
    private fb: FormBuilder) { }

  ngOnInit() {
    const id = +this.route.snapshot.paramMap.get('id');
    this.actor = this.actorService.getActor(id);

    if (id === -1 || this.actor == null) {
      this.cardTitle = 'Add New Actor';
      this.actor = new Actor();
      this.actor.name = '';
      this.actor.initialLevel = 0.0;
      this.actor.activationLevel = 0.0;
      this.actor.id = this.idService.nextActorId();
    } else {
      this.cardTitle = 'Edit Actor';
    }

    this.actorForm = this.fb.group({
      name: [this.actor.name, [Validators.required]],
      initialLevel: [this.actor.initialLevel, [Validators.required, Validators.min(0), Validators.max(1)]],
      activationLevel: [this.actor.activationLevel, [Validators.required, Validators.min, Validators.max]]
    });
  }

  save() {
    if (this.actorForm.valid){
      this.actor.name = this.actorForm.value['name'];
      this.actor.initialLevel = this.actorForm.value['initialLevel'];
      this.actor.activationLevel = this.actorForm.value['activationLevel'];
      this.actorService.saveActor(this.actor);
      this.router.navigate(['/actors']);
    } 
  }

  cancel() {
    this.router.navigate(['/actors']);
  }

  checkDirty(): boolean {
    if (this.actor.name != this.actorForm.value['name']) {
      return true;
    }

    if (this.actor.initialLevel != +this.actorForm.value['initialLevel']) {
      return true;
    }

    if (this.actor.activationLevel != + this.actorForm.value['activationLevel']) {
      return true;
    }
  }

}
