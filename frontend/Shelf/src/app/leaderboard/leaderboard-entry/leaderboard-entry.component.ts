import { Component, OnInit, Input } from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'leaderboard-entry',
  templateUrl: './leaderboard-entry.component.html',
  styleUrls: ['./leaderboard-entry.component.scss']
})
export class LeaderboardEntryComponent implements OnInit {

  @Input() username: string;
  @Input() score: string;

  constructor(private router: Router) { }

  ngOnInit() {

  }

  public goToProfile() {
    this.router.navigateByUrl(`/profile/${this.username}`)
  }
}
