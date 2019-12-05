import { NgModule } from '@angular/core';
import { AppRoutingModule } from '../app-routing.module';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { NavModule } from '../nav/nav.module';
import { FindUsersComponent } from './find-users/find-users.component';
import { UserOverviewModule } from '../user-overview/user-overview.module';


@NgModule({
  declarations: [
    FindUsersComponent,
  ],
  imports: [
    AppRoutingModule,
    CommonModule,
    FormsModule,
    BrowserModule,
    NavModule,
    UserOverviewModule
  ]
})
export class FindUsersModule { }
