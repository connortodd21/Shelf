import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-overview',
  templateUrl: './user-overview.component.html',
  styleUrls: ['./user-overview.component.scss']
})

export class UserOverviewComponent implements OnInit {

  @Input() username: string;

  constructor(private router: Router) { }

  ngOnInit() {

  }

  goToProfile = () => {
    window.location.replace(`/profile/${this.username}`);
  }

}
