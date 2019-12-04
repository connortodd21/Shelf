import { NgModule } from '@angular/core';
import { AppRoutingModule } from '../app-routing.module';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { NavModule } from '../nav/nav.module';
import {SearchPipe} from "./search.pipe";


@NgModule({
  declarations: [
    SearchPipe
  ],
  exports: [
    SearchPipe
  ],
  imports: [
    AppRoutingModule,
    CommonModule,
    FormsModule,
    BrowserModule,
    NavModule,
  ]
})
export class PipeModule { }
