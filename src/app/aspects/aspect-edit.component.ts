import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormArray} from '@angular/forms';
import { AspectService } from '../shared/aspect.service';
import { Aspect } from '../shared/aspect';
import { IdService } from '../shared/id.service';

@Component({
  selector: 'app-aspect-edit',
  templateUrl: './aspect-edit.component.html',
  styleUrls: ['./aspect-edit.component.css']
})
export class AspectEditComponent implements OnInit {
  private cardTitle: string;
  private aspect: Aspect;
  private aspectForm: FormGroup;
  private refForm: FormGroup;

  get layersets(): FormArray {
    return this.aspectForm.get('layersets') as FormArray;
  }

  constructor(private route: ActivatedRoute, 
              private aspectService: AspectService,
              private idService: IdService,
              private fb: FormBuilder,
              private router: Router) { }

  ngOnInit() {
    const id = +this.route.snapshot.paramMap.get('id');
    this.aspect = this.aspectService.getAspect(id);

    if (id === -1 || this.aspect == null) {
      this.cardTitle = 'Add New Aspect';
      this.aspect = new Aspect();
      this.aspect.layerSet = [];
      this.aspect.id = this.idService.nextAspectId();
    } else {
      this.cardTitle = 'Edit Aspect';
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

  addLayerset(): void {
    this.layersets.push(this.buildLayerset());
    //this.layersets.push(new FormControl('', [Validators.required]))
    //console.log(this.layersets.controls[0]);
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
      this.aspect.name = this.aspectForm.value['aspectName'];
      let layersets = this.aspectForm.value['layersets'];
      this.aspect.layerSet = [];
      layersets.forEach(element => {
        this.aspect.layerSet.push(element.layersetName);
      });

      this.aspectService.saveAspect(this.aspect);

      this.router.navigate(['/aspects']);
    }
  }

  cancel() {
    this.router.navigate(['/aspects']);
  }

  public checkDirty() {
    let dirty: boolean = false;
    let formAspectName = this.aspectForm.value['aspectName'];
    if (formAspectName  && (this.aspect.name != formAspectName)) {
      return true;
    }

    if (this.aspect.layerSet.length > 0 && 
      (this.aspect.layerSet.length !== this.aspectForm.value['layersets'].length)) {
      return true;
    }

    let layersets = this.aspectForm.value['layersets'];
    layersets.forEach(element => {
      if (!this.aspect.layerSet.includes(element.layersetName) && element.layersetName) {
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
          console.log('ok');
          return null;
        }

    } else {
      return null;
    }
  }

}
