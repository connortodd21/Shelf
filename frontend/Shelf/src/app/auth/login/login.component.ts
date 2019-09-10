import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../servies/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(private router: Router, public authService: AuthService) { }

  ngOnInit() {
    console.log('here');
  }

  onClick() {
    this.authService.registerUser('a@b.com', 'username', 'password', '2019-4-29').then( res => {
      console.log(res);
    });
  }

}
