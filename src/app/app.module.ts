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
import { LayersModule } from './layers/layers.module';

@NgModule({
  declarations: [
    AppComponent,
    PageNotFoundComponent,
    NavbarComponent
  ],
  imports: [
    BrowserModule,
    AspectModule,
    LayersModule,
    SharedModule,
    AppRoutingModule,
  ],
  providers: [ 
            IdService 
          ],
  bootstrap: [AppComponent]
})
export class AppModule { }
