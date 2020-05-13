import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormArray} from '@angular/forms';
import { Aspect } from '../shared/aspect';
import { IdService } from '../shared/id.service';

// NgRx-related state management
import { Store, select } from '@ngrx/store';
import * as fromAspects from './state';
import * as aspectActions from './state/aspect.actions';
import { takeWhile } from 'rxjs/operators';

@Component({
  selector: 'app-aspect-edit',
  templateUrl: './aspect-edit.component.html',
  styleUrls: ['./aspect-edit.component.css']
})
export class AspectEditComponent implements OnInit, OnDestroy {
  private cardTitle: string;
  private aspect: Aspect;
  private outAspect: Aspect = new Aspect();
  private aspectForm: FormGroup;
  private refForm: FormGroup;
  private componentActive = true;
  private create = false;

  get layersets(): FormArray {
    return this.aspectForm.get('layersets') as FormArray;
  }

  constructor(private route: ActivatedRoute, 
              private store: Store<fromAspects.AspectState>,
              private idService: IdService,
              private fb: FormBuilder,
              private router: Router) { }

  ngOnInit() {
    const id = +this.route.snapshot.paramMap.get('id');

    if (id === -1 ) {
      this.cardTitle = 'Add New Aspect';
      this.aspect = new Aspect();
      this.aspect.layerSet = [];
      this.aspect.id = this.idService.nextAspectId();
      this.create = true;
    } else {
      this.store.pipe(select(fromAspects.getAspect, {tid: id}), takeWhile(() => this.componentActive)).subscribe(asp => this.aspect = asp);
      this.cardTitle = 'Edit Aspect';
      this.create = false;
    }

    if (id === -1 || this.aspect == null) {
      this.aspectForm = this.fb.group({
        aspectName: ['', [Validators.required]],
        layersets: this.fb.array([this.buildLayerset()])
      });
    } else {
      this.aspectForm = this.fb.group({
        aspectName: [this.aspect.name, [Validators.required]],
        layersets: this.fb.array(this.aspect.layerSet.map(r => this.buildLayersetFormItem(r)))
      })
    }

    this.refForm = Object.assign({}, this.aspectForm);
  }

  ngOnDestroy() {
    this.componentActive = false;
  }

  addLayerset(): void {
    this.layersets.push(this.buildLayerset());
  }

  buildLayersetFormItem(name: string): FormGroup {
    return this.fb.group({
      layersetName: name,
    }, {validators: Validators.required});
  }
  buildLayerset(): FormGroup {
    return this.fb.group({
      layersetName: ['', 
      {validators: [Validators.required]}]
    });
  }

  removeAt(index: number) {
    this.layersets.removeAt(index);
  }

  save() {
    this.aspectForm.setValidators(this.layersetValidation);
    this.aspectForm.updateValueAndValidity();

    if (this.aspectForm.valid) {
      this.outAspect.name = this.aspectForm.value['aspectName'];
      this.outAspect.id = this.aspect.id;
      let layersets = this.aspectForm.value['layersets'];
      this.outAspect.layerSet = [];
      layersets.forEach(element => {
        this.outAspect.layerSet.push(element.layersetName);
      });

      this.componentActive = false;
      if (this.create) {
        this.store.dispatch(new aspectActions.CreateAspect(this.outAspect));
      } else {
        this.store.dispatch(new aspectActions.UpdateAspect(this.outAspect));
      }
      this.router.navigate(['/aspects']);
    } 
  }

  cancel() {
      if (this.aspectForm.valid) {
        this.outAspect.name = this.aspectForm.value['aspectName'];
        this.outAspect.id = this.aspect.id;
        let layersets = this.aspectForm.value['layersets'];
        this.outAspect.layerSet = [];
        layersets.forEach(element => {
          this.outAspect.layerSet.push(element.layersetName);
      });
    }
    this.router.navigate(['/aspects']);
  }

  public checkDirty() {
    let dirty: boolean = false;
    let formAspectName = this.aspectForm.value['aspectName'];

    if (formAspectName  && (this.outAspect.name != formAspectName)) {
      return true;
    }

    if (this.aspect.layerSet.length > 0 && 
      (this.outAspect.layerSet.length !== this.aspectForm.value['layersets'].length)) {
      return true;
    }

    let layersets = this.aspectForm.value['layersets'];
    layersets.forEach(element => {
      if (!this.outAspect.layerSet.includes(element.layersetName) && element.layersetName) {
        dirty = true;
      }
    });

    return dirty;
  }

  layersetValidation(item: FormGroup) {
    let formLayersets = item.value['layersets'];

    if (formLayersets != null) {
      let names: string[] = formLayersets.map(value => value.layersetName)
      let duplicates = names.filter((item, index) => names.indexOf(item) != index)
      if (duplicates.length > 0) {
          return {duplicates: 'duplicate entry'}
        } else {
          return null;
        }

    } else {
      return null;
    }
  }

}
