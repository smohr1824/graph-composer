import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NetworkdefinitionComponent } from './networkdefinition.component';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [NetworkdefinitionComponent],
  imports: [
    CommonModule,
    FormsModule,
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
