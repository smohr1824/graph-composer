import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActorComponent } from './actor.component';
import { ActorEditComponent } from './actoredit.component';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    ActorComponent,
    ActorEditComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    RouterModule.forChild([
      {
        path: 'actors',
        children: [
          {
            path: '',
            component: ActorComponent
          },
          {
            path: ':id',
            component: ActorEditComponent,
            canDeactivate: ['canDeactivateEdit'],
            children: [
              { path: '', redirectTo: 'actors', pathMatch: 'full' },
            ]
          }
        ]
      }
    ])
  ],
  providers: [
    { provide: 'canDeactivateEdit', useValue: checkDirtyState }
  ]
})
export class ActorModule { }

export function checkDirtyState(component: ActorEditComponent): boolean {
  if (component.checkDirty()) {
    return confirm('The actor has not been saved. Click OK to discard changes, Cancel to stay.');
  } else {
    return true;
  }
}
