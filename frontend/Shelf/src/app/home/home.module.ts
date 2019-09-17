import { NgModule } from '@angular/core';
import { HomeComponent } from './home/home.component';
import { AppRoutingModule } from "../app-routing.module";
import { CommonModule } from "@angular/common";
import { GameOverviewComponent } from '../game-overview/game-overview.component';
import { DetailedGameComponent } from '../detailed-game/detailed-game.component';



@NgModule({
  declarations: [
    HomeComponent,
    GameOverviewComponent,
    DetailedGameComponent
  ],
  imports: [
    AppRoutingModule,
    CommonModule
  ]
})
export class HomeModule { }
