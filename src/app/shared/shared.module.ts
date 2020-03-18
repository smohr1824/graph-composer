import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {  IdService } from './id.service';
import { WelcomeComponent } from './welcome.component'


@NgModule({
  declarations: [WelcomeComponent],
  imports: [
    CommonModule
  ],
  providers: [
    IdService
  ]
})
export class SharedModule { }
