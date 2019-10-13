import { NgModule } from '@angular/core';
import { AppRoutingModule } from "../app-routing.module";
import { CommonModule } from "@angular/common";
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from "@angular/forms";
import { NavModule } from '../nav/nav.module';
import { LeaderboardComponent } from './leaderboard.component';
import { LeaderboardEntryComponent } from './leaderboard-entry/leaderboard-entry.component';


@NgModule({
  declarations: [
    LeaderboardComponent,
    LeaderboardEntryComponent
  ],
  imports: [
    AppRoutingModule,
    CommonModule,
    FormsModule,
    BrowserModule,
    NavModule,
  ]
})
export class LeaderboardModule { }
