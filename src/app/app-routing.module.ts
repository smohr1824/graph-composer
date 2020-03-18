import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageNotFoundComponent } from './shared/page-not-found.component';
import { WelcomeComponent } from './shared/welcome.component';

const routes: Routes = [
    { path: 'Welcome', component: WelcomeComponent},
    { path: '', redirectTo: 'Welcome', pathMatch: 'full' },
    { path: '**', component: PageNotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
