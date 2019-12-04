import { Component, OnInit } from '@angular/core';
import {UserService} from '../user/user.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {

  username: string;

  constructor(private userService: UserService) { }

  ngOnInit() {
    this.username = localStorage.getItem('user');

  }

  logout() {
    console.log('logging out');
    this.userService.logoutUser();
  }

}
