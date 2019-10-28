import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'leaderboard-entry',
  templateUrl: './leaderboard-entry.component.html',
  styleUrls: ['./leaderboard-entry.component.scss']
})
export class LeaderboardEntryComponent implements OnInit {

  @Input() username: string;
  @Input() score: string;

  constructor() { }

  ngOnInit() {
    
  }
}
