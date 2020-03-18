import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PageNotFoundComponent } from './shared/page-not-found.component';
import { AspectModule } from './aspects/aspect.module';
import { NavbarComponent } from './navbar.component';
import { SharedModule } from './shared/shared.module';
import { IdService } from './shared/id.service';

@NgModule({
  declarations: [
    AppComponent,
    PageNotFoundComponent,
    NavbarComponent
  ],
  imports: [
    BrowserModule,
    AspectModule,
    SharedModule,
    AppRoutingModule,
  ],
  providers: [ 
    IdService ],
  bootstrap: [AppComponent]
})
export class AppModule { }
