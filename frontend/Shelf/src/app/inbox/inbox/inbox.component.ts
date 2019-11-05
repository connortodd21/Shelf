import { Component, OnInit } from '@angular/core';
import { Inbox } from '../../models/inbox.model';
import { InboxService } from './inbox.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inbox',
  templateUrl: './inbox.component.html',
  styleUrls: ['./inbox.component.scss']
})
export class InboxComponent implements OnInit {

  inbox: Inbox[];
  hasNotifications = false;
  component: string;
  componentUsername: string;

  constructor(private inboxService: InboxService, private router: Router) {
    this.inbox = [];
    this.component = 'inbox';
  }

  ngOnInit() {
    this.inboxService.getInbox().then(res => {
      // tslint:disable-next-line: no-string-literal
      const inbox = res['notification'];
      if (inbox) {
        this.hasNotifications = true;
        let i = 0;
        for (i = 0; i < inbox.length; i++) {
          if (inbox[i].message.includes('message')) {
            this.inbox[i] = new Inbox(inbox[i], 'message');
          } else {
            this.inbox[i] = new Inbox(inbox[i], 'follower');
          }
        }
      }
    });
  }

  renderComponent(location: string) {
    if (location === 'messages') {
      this.component = location;
    } else {
      const nav = '/profile/' + location;
      this.router.navigate([nav]);
    }
  }

}
