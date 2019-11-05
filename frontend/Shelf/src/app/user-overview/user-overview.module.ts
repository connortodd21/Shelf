import { NgModule } from '@angular/core';
import { AppRoutingModule } from '../app-routing.module';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { RatingModule } from 'primeng/rating';
import { FormsModule } from '@angular/forms';
import { UserOverviewComponent } from '../user-overview/user-overview.component';

@NgModule({
  declarations: [
    UserOverviewComponent
  ],
  exports: [
    UserOverviewComponent
  ],
  imports: [
    AppRoutingModule,
    CommonModule,
    FormsModule,
    BrowserModule,
    RatingModule
  ]
})
export class UserOverviewModule { }
