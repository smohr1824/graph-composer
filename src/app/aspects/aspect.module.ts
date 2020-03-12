import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AspectService } from './aspect.service';
import { AspectComponent } from './aspect.component';
import { AspectEditComponent } from './aspect-edit.component';


const aspectRoutes: Routes = [
  { path: 'aspects/:id', component: AspectEditComponent},
];

@NgModule({
  declarations: [
    AspectComponent,
    AspectEditComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(aspectRoutes),
  ], 
  providers: [
    AspectService
  ]

})
export class AspectModule { }
