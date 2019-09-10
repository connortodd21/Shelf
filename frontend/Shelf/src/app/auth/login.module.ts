import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import {MatCardModule} from '@angular/material/card';
import {ButtonModule} from 'primeng/button';
import {InputTextModule} from 'primeng/inputtext';
import {PasswordModule} from 'primeng/password';
import { FormsModule } from '@angular/forms';
import {InputMaskModule} from 'primeng/inputmask';



@NgModule({
  declarations: [LoginComponent],
  imports: [
    CommonModule,
    ButtonModule,
    InputMaskModule,
    MatCardModule,
    InputTextModule,
    PasswordModule,
    FormsModule,

  ]
})
export class LoginModule { }
