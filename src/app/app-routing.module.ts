import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AspectContainerComponent } from './aspects/aspect-container.component';
import { PageNotFoundComponent } from './shared/page-not-found.component';

const routes: Routes = [
    { path: 'aspects', component: AspectContainerComponent},
    { path: '', redirectTo: 'aspects', pathMatch: 'full' },
    { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
