import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AspectService } from '../shared/aspect.service';
import { AspectComponent } from './aspect.component';
import { AspectContainerComponent } from './aspect-container.component';
import { AspectListComponent } from './aspect-list.component';
import { LayersetListComponent } from './layerset-list.component';
import { AspectEditComponent } from './aspect-edit.component';
import { SharedModule } from '../shared/shared.module';
import { PageNotFoundComponent } from '../shared/page-not-found.component';

@NgModule({
  declarations: [
    AspectComponent,
    AspectContainerComponent,
    AspectListComponent,
    LayersetListComponent,
    AspectEditComponent
  ],
  imports: [
    SharedModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild([
      {
        path: 'aspects',
        children: [
          {
            path: '',
            component: AspectContainerComponent
          },
          {
            path: ':id',
            component: AspectEditComponent,
            children: [
              { path: '', redirectTo: 'aspects', pathMatch: 'full' },
            ]
          }
        ]
      }
    ])
  ], 
  providers: [
    AspectService
  ]

})
export class AspectModule { }
