import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginComponent } from '../login/login/login.component';
import {LoginModule} from "../login/login.module";
import {RouterTestingModule} from "@angular/router/testing";
import {ToastModule} from "primeng/toast";
import {ButtonModule} from "primeng/button";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CalendarModule} from "primeng/calendar";
import {CommonModule} from "@angular/common";
import {InputMaskModule} from "primeng/inputmask";
import {MatCardModule} from "@angular/material/card";
import {InputTextModule} from "primeng/inputtext";
import {PasswordModule} from "primeng/password";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {AuthData} from "../models/auth.data.model";
import {LoginService} from "../login/login/login.service";
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {LOGIN_URL} from "../constants/constants.urls";
import {HttpModule} from "@angular/http";

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let loginService: LoginService;
  let httpTestingController: HttpTestingController;
  const userInfo: AuthData = { username: 'TestUser', password: 'TestPassword', email: "test@g.com", birthday: '01/01/2000' };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginComponent ],
      imports: [
        CommonModule,
        ButtonModule,
        InputMaskModule,
        MatCardModule,
        InputTextModule,
        PasswordModule,
        FormsModule,
        ToastModule,
        CalendarModule,
        NgbModule,
        ReactiveFormsModule,
        RouterTestingModule,
        //HttpClientTestingModule,
        HttpClientModule
      ],
      providers: [
        { provide: LOGIN_URL, useValue: 'http://localhost:8080/user/login' },
        LoginService
      ]

    });
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    loginService = TestBed.get(LoginService);
    //httpTestingController = TestBed.get(HttpTestingController);

    fixture.detectChanges();


  });


  it('Login component should successfully render', () => {
    expect(component).toBeTruthy();
  });

  it('Login component should say "Login!" after init', () => {
    expect(component.subtitle).toBe("Login!");
  });

  it('Login service should compile', () => {
    expect(loginService).toBeTruthy();
  });

  it('Login service can register', (done) => {

    const u = 'U' + Math.random().toString(36).substring(7);
    const p = 'P' + Math.random().toString(36).substring(7);
    const e = Math.random().toString(36).substring(7) + '@g.com';
    const dataForRegisterTestOnly: AuthData = { username: u, password: p, email: e, birthday: '01/01/2000' };

    loginService.registerUser(dataForRegisterTestOnly).subscribe(
      res => {
        expect(res.username).toEqual(dataForRegisterTestOnly.username);
        expect(res.birthday).toEqual('2000-01-01T05:00:00.000Z');
        expect(res.email).toEqual(dataForRegisterTestOnly.email);
        done();
      }
    );

  });

  it('Login service can detect conflicting accounts during registration', (done) => {


    loginService.registerUser(userInfo).subscribe(
      res => {

        fail("Should have detected conflicting accounts during registration")
      },
      error => {
        expect(error).toBeTruthy();
        expect(error.status).toEqual(409);
        expect(error.statusText).toEqual('Conflict');
        expect(error.error.message).toEqual('Conflict: User already exists');
        done();
      }
    );

  });

  // it('Login service can login', () => {
  //
  //   loginService.loginUser(userInfo.username, userInfo.password).subscribe(
  //     res => {
  //       console.log(res);
  //       expect(1).toEqual(1);
  //     },
  //     err => {
  //       console.log(err);
  //     }
  //   );
  //
  //
  //   expect(1).toEqual(1);


    // const req = httpTestingController.expectOne('http://localhost:8080/user/login');
    // expect(req.request.method).toEqual('POST');
    // expect(req.request.body.username).toEqual(username);
    // expect(req.request.body.password).toEqual(password);
    // expect(req.request.body.email).toEqual('');
    // expect(req.request.body.birthday).toEqual('');
    // expect(req.request.responseType).toEqual('json');

    //req.request.headers
    //httpTestingController.verify();
  // });



});
