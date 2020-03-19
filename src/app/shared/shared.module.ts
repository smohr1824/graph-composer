import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {  IdService } from './id.service';
import { WelcomeComponent } from './welcome.component'
import { AspectService } from './aspect.service';


@NgModule({
  declarations: [WelcomeComponent],
  imports: [
    CommonModule
  ],
  providers: [
    IdService,
    AspectService
  ]
})
export class SharedModule { }
