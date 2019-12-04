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
        element.forEach(item => {
          this.feed[i++] = new Feed(item);
        });
      });
      if (i !== 0) {
        this.hasFeed = true;
      }
      // tslint:disable: max-line-length
      this.feed.sort((a: {timeStamp: Date}, b: {timeStamp: Date}) => (new Date(b.timeStamp) > new Date(a.timeStamp)) ? 1 : (new Date(a.timeStamp) > new Date(b.timeStamp)) ? -1 : 0);
    });
  }

  goToProfile = (username: string) => {
    window.location.replace(`/profile/${username}`);
  }


}
