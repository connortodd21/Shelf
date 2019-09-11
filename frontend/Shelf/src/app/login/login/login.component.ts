import { Component, OnInit } from '@angular/core';
import { LoginService } from './login.service';
import { Router } from '@angular/router';
import { AuthData } from '../../models/auth.data.model';
import {MessageService} from 'primeng/api';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [MessageService]
})
export class LoginComponent implements OnInit {

  email: string;
  username: string;
  password: string;
  isRegistering: boolean;
  birthday: string;
  subtitle: string;

  constructor(private router: Router, public loginService: LoginService, private messageService: MessageService) { }

  ngOnInit() {
    this.subtitle = 'Login!';
  }

  registerUser() {

    this.subtitle = 'Sign up!';

    const authData: AuthData = {username: this.username, password: this.password, email: this.email, birthday: this.birthday};

    if (this.isRegistering) {

      if (this.isFieldEmpty(authData)) {
        this.showError();
      } else {

        this.loginService.registerUser(authData).subscribe( res => {
          console.log(res);
        });

      }
    } else {
        this.isRegistering = !this.isRegistering;
      }

  }

  isFieldEmpty(auth: AuthData): boolean {

    if (!auth.username || !auth.email || !auth.password || !auth.birthday) {
      console.log('empty');
      return true;
    }
    return false;
  }


  loginUser() {
    this.subtitle = 'Login!';
    this.isRegistering = false;
    this.loginService.login(this.username, this.password).then( res => {
      // console.log(res)
    });
  }


  showError() {
    this.messageService.add({severity: 'error', summary: 'Error!', detail: 'All fields must be filled out'});
  }

}
