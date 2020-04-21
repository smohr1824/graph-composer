import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NetworkdefinitionComponent } from './networkdefinition.component';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [NetworkdefinitionComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: 'network',
        children: [
          {
            path: '',
            component: NetworkdefinitionComponent,
            children: [
              { path: '', redirectTo: 'network', pathMatch: 'full' },
            ]
          }
        ]
      }
    ])
  ]
})
export class NetworkModule { }
