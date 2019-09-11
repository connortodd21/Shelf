import { NgModule } from '@angular/core';
import { HomeComponent } from './home/home.component';
import {AppRoutingModule} from "../app-routing.module";



@NgModule({
  declarations: [
    HomeComponent
  ],
  imports: [
    AppRoutingModule

  ]
})
export class HomeModule { }
