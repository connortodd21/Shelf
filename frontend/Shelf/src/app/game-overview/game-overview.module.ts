import { NgModule } from '@angular/core';
import { AppRoutingModule } from "../app-routing.module";
import { CommonModule } from "@angular/common";
import { BrowserModule } from '@angular/platform-browser';
import { RatingModule } from 'primeng/rating';
import { FormsModule } from "@angular/forms";
import { GameOverviewComponent } from "../game-overview/game-overview.component";

@NgModule({
  declarations: [
    GameOverviewComponent
  ],
  exports: [
    GameOverviewComponent
  ],
  imports: [
    AppRoutingModule,
    CommonModule,
    FormsModule,
    BrowserModule,
    RatingModule
  ]
})
export class GameOverviewModule { }
