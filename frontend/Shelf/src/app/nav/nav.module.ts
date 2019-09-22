import { NgModule } from '@angular/core';
import { AppRoutingModule } from "../app-routing.module";
import { CommonModule } from "@angular/common";
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from "@angular/forms";
import { NavComponent } from "../nav/nav.component";

@NgModule({
  declarations: [
    NavComponent
  ],
  exports: [
    NavComponent
  ],
  imports: [
    AppRoutingModule,
    CommonModule,
    FormsModule,
    BrowserModule
  ]
})
export class NavModule { }
