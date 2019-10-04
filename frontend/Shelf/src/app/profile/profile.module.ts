import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputMaskModule } from 'primeng/inputmask';
import { ToastModule } from 'primeng/toast';
import { ProfileComponent } from './profile/profile.component';
import { GameOverviewModule } from '../game-overview/game-overview.module';
import { NavModule } from '../nav/nav.module';
import { UserOverviewModule } from '../user-overview/user-overview.module';



@NgModule({
  declarations: [
    ProfileComponent
  ],
  imports: [
    CommonModule,
    ButtonModule,
    InputMaskModule,
    MatCardModule,
    InputTextModule,
    PasswordModule,
    FormsModule,
    ToastModule,
    ReactiveFormsModule,
    GameOverviewModule,
    NavModule,
    UserOverviewModule
  ]
})
export class ProfileModule { }
