import { Component, OnInit } from '@angular/core';
import { LoginService } from './login.service';
import { Router } from '@angular/router';
import { AuthData } from '../../models/auth.data.model';
import { MessageService } from 'primeng/api';
import { NgForm, FormGroup, FormBuilder, Validators } from '@angular/forms';

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
  loginForm: FormGroup;
  loginSubmit = false;
  registerForm: FormGroup;
  registerSubmit = false;


  // tslint:disable-next-line: max-line-length
  constructor(private router: Router, public loginService: LoginService, private messageService: MessageService, private formBuilder: FormBuilder) {
    if (this.loginService.getAuthToken()) {
      this.router.navigate(['/home']);
    }
  }

  ngOnInit() {
    this.subtitle = 'Login!';
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  registerUser() {

    this.subtitle = 'Sign up!';

    const authData: AuthData = { username: this.username, password: this.password, email: this.email, birthday: this.birthday };

    if (this.isRegistering) {
      this.loginService.registerUser(authData).subscribe(
        () => { this.showRegistrationSuccess(); },
        error => { this.showError(error.error.message); },
      );
    } else {
      this.isRegistering = !this.isRegistering;
    }
  }


  loginUser(form: NgForm) {
    this.loginSubmit = true;
    this.subtitle = 'Login!';
    if (this.loginForm.invalid) {
      return;
    }
    if (!this.isRegistering) {
      this.loginService.loginUser(form.value.username, form.value.password).subscribe(
        response => {
        },
        error => {this.showError(error.error.message); }
      );
    } else {
      this.isRegistering = !this.isRegistering;
    }
  }

  showError(errorMessage = 'All fields must be filled out') {
    this.messageService.add({ severity: 'error', summary: 'Error!', detail: errorMessage });
  }

  showRegistrationSuccess(successMessage = 'Registration successful!') {
    this.messageService.add({ severity: 'success', summary: 'Success!', detail: successMessage });
  }

}
