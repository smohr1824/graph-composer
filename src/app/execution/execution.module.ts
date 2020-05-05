import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { RunContainerComponent } from './run-container.component';
import { RunAggregateComponent } from './run-aggregate.component';
import { FormsModule } from '@angular/forms';
import { EffectsModule } from '@ngrx/effects';
import { ExecutionEffects } from './state/execution.effects';
import { RunLayersComponent } from './run-layers.component';



@NgModule({
  declarations: [
    RunContainerComponent,
    RunAggregateComponent,
    RunLayersComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    EffectsModule.forFeature([ExecutionEffects]),
    RouterModule.forChild([
      {
        path: 'execute',
        children: [
          {
            path: '',
            component: RunContainerComponent
          }
        ]
      }
    ])
  ]
})
export class ExecutionModule { }
