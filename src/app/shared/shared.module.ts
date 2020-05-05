import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {  IdService } from './id.service';
import { WelcomeComponent } from './welcome.component'
import { AspectService } from './aspect.service';
import { LayerService } from './layer.service';
import { FcmService } from './fcm.service';


@NgModule({
  declarations: [WelcomeComponent],
  imports: [
    CommonModule
  ],
  providers: [
    IdService,
    AspectService,
    LayerService,
    FcmService
  ]
})
export class SharedModule { }
