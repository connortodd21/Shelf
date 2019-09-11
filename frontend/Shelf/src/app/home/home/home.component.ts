import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {UserModel} from "../../models/user.model";
import {UserService} from "../../user/user.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  user: UserModel;


  constructor(private router: Router, private userService: UserService) { }
    ngOnInit() {
    console.log('HOME PAGE');
    this.setupUser();
  }

  logout() {
    if (!this.userService.logoutUser()) {

    }
  }

  private setupUser() {
    this.userService.fetchUser().subscribe(
      (response) => {
        console.log(response);
        this.user = {birthday: response.birthday, email: response.email, username: response.username};
      },
      (error) => console.log(error)
    )
  }
}
