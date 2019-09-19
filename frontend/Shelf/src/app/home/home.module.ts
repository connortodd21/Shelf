import { NgModule } from '@angular/core';
import { HomeComponent } from './home/home.component';
import { AppRoutingModule } from "../app-routing.module";
import { CommonModule } from "@angular/common";
import { GameOverviewComponent } from '../game-overview/game-overview.component';
import { DetailedGameComponent } from '../detailed-game/detailed-game.component';
import { BrowserModule } from '@angular/platform-browser';
import {RatingModule} from 'primeng/rating';
import {FormsModule} from "@angular/forms";

@NgModule({
  declarations: [
    HomeComponent,
    GameOverviewComponent,
    DetailedGameComponent
  ],
  imports: [
    AppRoutingModule,
    CommonModule,
    FormsModule,
    BrowserModule,
    RatingModule,
  ]
})
export class HomeModule { }
