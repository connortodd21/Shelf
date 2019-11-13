import { Component, OnInit } from '@angular/core';
import { FeedService } from './feed.service';
import { Feed } from '../../models/feed.model';


@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.scss']
})
export class FeedComponent implements OnInit {

  feed: Feed[];
  hasFeed: boolean;

  constructor(private feedService: FeedService) {
    this.feed = [];
    this.hasFeed = false;
  }

  ngOnInit() {
    this.feedService.getFeed().then((res) => {
      let i = 0;
      res.forEach(element => {
        this.feed[i++] = new Feed(element);
      });
      if (i !== 0) {
        this.hasFeed = true;
      }
    });
  }

}
