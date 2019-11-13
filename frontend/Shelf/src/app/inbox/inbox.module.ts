import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InboxComponent } from './inbox/inbox.component';
import { NavModule } from '../nav/nav.module';
import { MessageModule } from '../message/message.module';
import { ProfileModule } from '../profile/profile.module';

@NgModule({
    declarations: [
        InboxComponent
    ],
    imports: [
        CommonModule,
        NavModule,
        ProfileModule,
        MessageModule
    ]
})
export class InboxModule { }
