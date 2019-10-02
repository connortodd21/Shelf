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
import {Test} from "tslint";
import {log} from "util";

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let loginService: LoginService;
  let httpTestingController: HttpTestingController;

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
        HttpClientTestingModule
      ],
      providers: [
        LoginService
      ]

    });
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    loginService = TestBed.get(LoginService);
    httpTestingController = TestBed.get(HttpTestingController);

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

  it('Login service can register', () => {

    const authData: AuthData = { username: 'user', password: 'pass', email: 'a@a', birthday: '01/01/2000' };

    loginService.registerUser(authData).subscribe(
      res => {
        expect(res.username).toEqual(authData.username);
        expect(res.password).toEqual(authData.password);
        expect(res.birthday).toEqual(authData.birthday);
        expect(res.email).toEqual(authData.email);
      }
    );


    const req = httpTestingController.expectOne('http://localhost:8080/user/register');

    expect(req.request.method).toEqual('POST');

    req.flush(authData);
    httpTestingController.verify();
  });

  it('Login service can login', () => {

    const username = 'user';
    const password = 'password';

    loginService.loginUser(username, password).subscribe(
      res => {
        // expect(res.username).toEqual(authData.username);
        // expect(res.password).toEqual(authData.password);
        // expect(res.birthday).toEqual(authData.birthday);
        // expect(res.email).toEqual(authData.email);
      }
    );


    const req = httpTestingController.expectOne('http://localhost:8080/user/login');
    expect(req.request.method).toEqual('POST');
    expect(req.request.body.username).toEqual(username);
    expect(req.request.body.password).toEqual(password);
    expect(req.request.body.email).toEqual('');
    expect(req.request.body.birthday).toEqual('');
    expect(req.request.responseType).toEqual('json');


    //req.flush(authData);
    httpTestingController.verify();
  });



});
