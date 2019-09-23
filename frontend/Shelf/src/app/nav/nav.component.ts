import { Component, OnInit } from '@angular/core';
import {UserService} from "../user/user.service";

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {

  constructor(private userService: UserService) { }

  ngOnInit() {
  }

  logout() {
    console.log('logging out');
    this.userService.logoutUser()
  }

}
