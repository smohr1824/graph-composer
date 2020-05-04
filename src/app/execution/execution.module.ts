import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { RunContainerComponent } from './run-container.component';
import { RunAggregateComponent } from './run-aggregate.component';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    RunContainerComponent,
    RunAggregateComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
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
