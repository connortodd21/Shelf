import { NgModule } from '@angular/core';
import { HomeComponent } from './home/home.component';
import { AppRoutingModule } from "../app-routing.module";
import { CommonModule } from "@angular/common";
import { GameOverviewComponent } from '../game-overview/game-overview.component';
import { DetailedGameComponent } from '../detailed-game/detailed-game.component';
import { RatingModule } from 'ng-starrating';
import { BrowserModule } from '@angular/platform-browser';

@NgModule({
  declarations: [
    HomeComponent,
    GameOverviewComponent,
    DetailedGameComponent
  ],
  imports: [
    AppRoutingModule,
    CommonModule,
    RatingModule,
    BrowserModule
  ]
})
export class HomeModule { }
