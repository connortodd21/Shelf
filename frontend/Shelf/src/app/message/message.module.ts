import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputMaskModule } from 'primeng/inputmask';
import { ToastModule } from 'primeng/toast';
import { MessageComponent } from './message/message.component';
import {NavModule} from '../nav/nav.module';


@NgModule({
  declarations: [
    MessageComponent
  ],
  exports: [
    MessageComponent
  ],
  imports: [
  CommonModule,
    ButtonModule,
    InputMaskModule,
    MatCardModule,
    InputTextModule,
    FormsModule,
    ToastModule,
    ReactiveFormsModule,
    NavModule
  ]
})
export class MessageModule { }
