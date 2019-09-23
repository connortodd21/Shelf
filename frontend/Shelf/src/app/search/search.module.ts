import { NgModule } from '@angular/core';
import { AppRoutingModule } from '../app-routing.module';
import { SearchComponent } from './search//search.component';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { RatingModule } from 'primeng/rating';
import { FormsModule } from '@angular/forms';
import { GameOverviewModule } from '../game-overview/game-overview.module';
import { NavModule } from '../nav/nav.module';

@NgModule({
  declarations: [
    SearchComponent
  ],
  imports: [
    AppRoutingModule,
    CommonModule,
    FormsModule,
    BrowserModule,
    RatingModule,
    GameOverviewModule,
    NavModule
  ]
})
export class SearchModule { }
