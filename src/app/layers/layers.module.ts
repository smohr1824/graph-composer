import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, CanActivate } from '@angular/router';
import { LayersComponent } from './layers.component';
import { LayerEditComponent } from './layer-edit.component';
import { GraphGuard } from '../graph.guard'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { reducers } from '../state/app.state';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { LayerEffects } from './state/layer.effects';


@NgModule({
  declarations: [
            LayersComponent,
            LayerEditComponent
          ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild([
      {
        path: 'layers',
        children: [
          {
            path: '',
            canActivate: [GraphGuard],
            component: LayersComponent
          },
          {
            path: ':id',
            canActivate: [GraphGuard],
            component: LayerEditComponent,
            children: [
              { path: '', redirectTo: 'layers', pathMatch: 'full' },
            ]
          }
        ]
      }
    ]),
    EffectsModule.forFeature([LayerEffects])
  ]
})
export class LayersModule { }
