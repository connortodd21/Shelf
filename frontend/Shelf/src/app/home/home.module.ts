import { NgModule } from '@angular/core';
import { HomeComponent } from './home/home.component';
import {AppRoutingModule} from "../app-routing.module";
import {CommonModule} from "@angular/common";



@NgModule({
  declarations: [
    HomeComponent
  ],
  imports: [
    AppRoutingModule,
    CommonModule

  ]
})
export class HomeModule { }
