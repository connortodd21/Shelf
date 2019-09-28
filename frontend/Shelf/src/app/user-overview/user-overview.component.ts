import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-user-overview',
  templateUrl: './user-overview.component.html',
  styleUrls: ['./user-overview.component.scss']
})
export class UserOverviewComponent implements OnInit {

  @Input() username: string;

  constructor() { }

  ngOnInit() {

  }

  goToProfile = () => {
    console.log('Going to the profile!');
  }

}
