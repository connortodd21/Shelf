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
import { TopIconComponent } from '../top-icon/top-icon.component';
import {DropdownModule} from "primeng/dropdown";
import {AppModule} from "../app.module";
import {PipeModule} from "../filter/pipe.module";



@NgModule({
  declarations: [
    ProfileComponent,
    TopIconComponent
  ],
  exports: [
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
    UserOverviewModule,
    DropdownModule,
    PipeModule
  ]
})
export class ProfileModule { }
