import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-basic-game-overview',
  templateUrl: './basic-game-overview.component.html',
  styleUrls: ['./basic-game-overview.component.scss']
})
export class BasicGameOverviewComponent {
  constructor(private router: Router) { }

  @Input() name: string;
  // tslint:disable: variable-name
  @Input() id: string;
  @Input() globalRating: number;
  @Input() userRating: number;
  @Input() user: string

  gotoDetailedGameView() {
    this.router.navigate([`/detailed-game/${this.id}`], {state: {globalRating: this.globalRating, userRating: this.userRating }});
  }

}
