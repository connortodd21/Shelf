import { Component, OnInit } from '@angular/core';
import { Inbox } from '../../models/inbox.model';
import { InboxService } from './inbox.service';

@Component({
  selector: 'app-inbox',
  templateUrl: './inbox.component.html',
  styleUrls: ['./inbox.component.scss']
})
export class InboxComponent implements OnInit {

  inbox: Inbox[];
  hasNotifications = false;

  constructor(private inboxService: InboxService) {
    this.inbox = [];
  }

  ngOnInit() {
    this.inboxService.getInbox().then(res => {
      // tslint:disable-next-line: no-string-literal
      const inbox = res['notification'];
      if (inbox) {
        this.hasNotifications = true;
        console.log(res);
        let i = 0;
        for (i = 0; i < inbox.length; i++) {
          this.inbox[i] = new Inbox(inbox[i]);
        }
      }
    });
  }

}
