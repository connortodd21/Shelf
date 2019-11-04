import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InboxComponent } from './inbox/inbox.component';
import {NavModule} from '../nav/nav.module';



@NgModule({
    declarations: [
        InboxComponent
    ],
    imports: [
        CommonModule,
        NavModule
    ]
})
export class InboxModule { }
