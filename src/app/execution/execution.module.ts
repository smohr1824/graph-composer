import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { RunContainerComponent } from './run-container.component';



@NgModule({
  declarations: [
    RunContainerComponent
  ],
  imports: [
    CommonModule,
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
