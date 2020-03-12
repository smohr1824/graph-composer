import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AspectComponent } from './aspects/aspect.component';
import { PageNotFoundComponent } from './shared/page-not-found.component';

const routes: Routes = [
    { path: 'aspects', component: AspectComponent},
    { path: '', redirectTo: 'aspects', pathMatch: 'full' },
    { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
