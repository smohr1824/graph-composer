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
import { ActorComponent } from './actors/actor.component';
import { ActorModule } from './actors/actor.module';
import { StoreModule, MetaReducer, Store } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '../environments/environment';
import { reducers } from './state/app.state';
import { NetworkModule } from './network/network.module';
import { ExecutionModule } from './execution/execution.module';

@NgModule({
  declarations: [
    AppComponent,
    PageNotFoundComponent,
    NavbarComponent,
  ],
  imports: [
    BrowserModule,
    NetworkModule,
    AspectModule,
    ActorModule,
    LayersModule,
    ExecutionModule,
    SharedModule,
    AppRoutingModule,
    StoreModule.forRoot(reducers),
    EffectsModule.forRoot([]),
    StoreDevtoolsModule.instrument({
      name: 'graph-composer',
      maxAge: 25,
      logOnly: environment.production
    })
  ],
  providers: [ 
            IdService
          ],
  bootstrap: [AppComponent]
})
export class AppModule { }
