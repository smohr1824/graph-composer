import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, AbstractControl, ValidatorFn, FormArray } from '@angular/forms';
import { AspectService } from './aspect.service';
import { Aspect } from './aspect';
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
      console.log('new aspect');
      this.aspect = new Aspect();
      this.aspect.layerSet = [];
      this.aspect.id = this.idService.nextAspectId();
    } else {
      this.cardTitle = 'Edit Aspect';
      console.log('existing aspect: ' + id);
    }

    this.aspectForm = this.fb.group({
      aspectName: ['', [Validators.required]],
      layersets: this.fb.array([this.buildLayerset()])
    });

  }

  addLayerset(): void {
    this.layersets.push(this.buildLayerset());
  }

  buildLayerset(): FormGroup {
    return this.fb.group({
      layersetName: ['', Validators.required],
    });
  }

  save() {
    this.aspect.name = this.aspectForm.value['aspectName'];
    let layersets = this.aspectForm.value['layersets'];
    layersets.forEach(element => {
      this.aspect.layerSet.push(element.layersetName);
    });

    console.log(this.aspect);
    this.aspectService.saveAspect(this.aspect);
     this.router.navigate(['/aspects']);
  }

}
